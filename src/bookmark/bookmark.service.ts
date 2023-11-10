import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDtoWithId } from './dto';
import { ClickService } from 'src/click/click.service';
import { BookmarkInterface, ChildUrlsInterFace } from './types';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clickService: ClickService,
    private readonly contentService: ContentService,
  ) {}

  public async create(data: {
    email: string;
    url: string;
    childUrls: string[];
    alias?: string;
  }): Promise<BookmarkDtoWithId> {
    const aliasInput = data.alias ? data.alias : null;
    try {
      const bookmark = await this.prismaService.bookmark.create({
        data: {
          url: data.url,
          userEmail: data.email,
          alias: aliasInput,
        },
      });
      await this.clickService.create(bookmark.id);
      if (data.childUrls[0]) {
        await this.addChildUrls(bookmark.id, data.childUrls);
      }
      const { deletedAt, createdAt, updatedAt, alias, ...rest } = bookmark;
      return rest;
    } catch (err) {
      throw new Error('Failed to add bookmark');
    }
  }

  public async patch(data: {
    email: string;
    id: string;
    url: string;
    childUrls?: ChildUrlsInterFace[];
    childUrlsNew?: string[];
  }): Promise<BookmarkDtoWithId> {
    try {
      const bookmark = await this.prismaService.bookmark.update({
        where: {
          userEmail: data.email,
          id: data.id,
        },
        data: {
          url: data.url,
          userEmail: data.email,
        },
      });
      await this.clickService.create(bookmark.id);
      if (data.childUrls[0]) {
        await this.patchChildUrls(bookmark.id, data.childUrls);
      }
      if (data.childUrlsNew[0]) {
        await this.addChildUrls(bookmark.id, data.childUrlsNew);
      }
      const { deletedAt, createdAt, updatedAt, alias, ...rest } = bookmark;
      console.log(rest, ' in patch');
      return rest;
    } catch (err) {
      throw new Error('Failed to add bookmark');
    }
  }

  public async addChildUrls(id: string, urls: string[]) {
    try {
      const childCreatePromises = urls.map(async (url) => {
        await this.prismaService.bookmarkChildren.create({
          data: {
            url,
            bookmarkId: id,
          },
        });
      });

      const addedChildren = await Promise.all(childCreatePromises);
    } catch (err) {
      throw err;
    }
  }
  public async patchChildUrls(
    id: string,
    data: ChildUrlsInterFace[] | undefined,
  ) {
    try {
      if (data && data.length > 0) {
        const childCreatePromises = data.map(async (child) => {
          await this.prismaService.bookmarkChildren.update({
            where: {
              id: child.id,
            },
            data: {
              url: child.url,
            },
          });
        });
        // Use Promise.all to await all create operations
        await Promise.all(childCreatePromises);
      }
    } catch (error) {
      // Handle errors here
      console.error('Error patching child URLs:', error);
    }
  }

  public async get({
    email,
    skip = 0,
    limit = 100,
  }: {
    email: string;
    skip?: number;
    limit?: number;
  }): Promise<BookmarkInterface[]> {
    try {
      const takeAll = limit === null;
      const bookmarks = await this.prismaService.bookmark.findMany({
        where: {
          userEmail: email,
          deletedAt: {
            equals: null,
          },
        },
        include: {
          children: true,
          Click: true,
          Content: true,
        },

        skip: skip,
        take: limit,
      });

      // fix click namening and filtering, fix so its not a array
      const filteredBookmarks = bookmarks?.map((bookmark) => {
        const click = bookmark.Click[0];

        const { deletedAt, updatedAt, Click, Content, ...rest } = bookmark;
        return { ...rest, analytics: { click }, content: Content };
      });

      const sortedBookmarks = this.sort(filteredBookmarks);

      return sortedBookmarks;
    } catch (err) {
      console.log(err);
      throw new Error('Couldnt get bookmarks');
    }
  }
  public async getById({
    email,
    id,
  }: {
    email: string;
    id: string;
  }): Promise<BookmarkInterface> {
    try {
      const bookmark = await this.prismaService.bookmark.findUnique({
        where: {
          userEmail: email,
          id: id,
          deletedAt: {
            equals: null,
          },
        },
        include: {
          children: true,
          Content: true,
        },
      });
      const content = bookmark.Content;
      return { ...bookmark, content };
    } catch (err) {
      console.log(err);
      throw new Error('Couldnt get bookmark');
    }
  }

  public async delete(id: string, emailFromToken: string) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: id,
      },
    });

    if (bookmark && bookmark.userEmail === emailFromToken) {
      try {
        const deletedClicks = await this.prismaService.click.deleteMany({
          where: {
            bookmarkId: bookmark.id,
          },
        });

        const deletedContent = await this.prismaService.content.deleteMany({
          where: {
            bookmarkId: id,
          },
        });

        const deletedBookmarkChildren =
          await this.prismaService.bookmarkChildren.deleteMany({
            where: {
              bookmarkId: id,
            },
          });

        const deletedBookmark = await this.prismaService.bookmark.delete({
          where: {
            id: id,
          },
        });

        if (deletedBookmark) {
          return { message: 'Bookmark successfully deleted' };
        } else {
          console.error('Bookmark could not be deleted.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    } else {
      console.error('Invalid request. Email does not match.');
    }
  }

  public async generateDefault(email: string): Promise<BookmarkDtoWithId[]> {
    try {
      const createdBookmarks: BookmarkDtoWithId[] = [];
      const bookmarks: string[] = this.bookmarkData.bookmarks;
      for (const url of bookmarks) {
        const bookmark = await this.prismaService.bookmark.create({
          data: {
            url: url,
            userEmail: email,
          },
        });

        await this.clickService.create(bookmark.id);

        createdBookmarks.push(bookmark);
      }

      return createdBookmarks;
    } catch (err) {
      throw new Error('Failed to add bookmarks');
    }
  }

  private sort(bookmarks: BookmarkInterface[]) {
    const sortedBookmarks = bookmarks?.sort((a, b) => {
      const clicksA =
        (a.analytics?.click?.clickCount || 0) +
        (a.analytics.click?.clickCount || 0);
      const clicksB =
        (b.analytics?.click?.clickCount || 0) +
        (b.analytics.click?.clickCount || 0);

      return clicksB - clicksA;
    });
    return sortedBookmarks;
  }

  private bookmarkData = {
    bookmarks: [
      'https://www.youtube.com',
      'https://www.facebook.com',
      'https://mail.google.com',
      'https://www.google.com',
      'https://www.netflix.com',
      'https://www.hbomax.com',
      'https://www.linkedin.com/feed',
    ],
  };
}
