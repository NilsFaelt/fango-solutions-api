import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDtoWithId } from './dto';
import { ClickService } from 'src/click/click.service';
import { BookmarkInterface } from './types';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clickService: ClickService,
  ) {}

  public async create(data: {
    email: string;
    url: string;
    childUrls: string[];
  }): Promise<BookmarkDtoWithId> {
    try {
      const bookmark = await this.prismaService.bookmark.create({
        data: {
          url: data.url,
          userEmail: data.email,
        },
      });
      await this.clickService.create(bookmark.id);
      if (data.childUrls[0]) {
        await this.addChildUrls(bookmark.id, data.childUrls);
      }
      const { deletedAt, createdAt, updatedAt, ...rest } = bookmark;
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
        },

        skip: skip,
        take: limit,
      });
      // fix click namening and filtering, fix so its not a array
      const filteredBookmarks = bookmarks?.map((bookmark) => {
        const click = bookmark.Click[0];

        const { deletedAt, updatedAt, Click, ...rest } = bookmark;
        return { ...rest, analytics: { click } };
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
        },
      });

      return bookmark;
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
      const deletedBookmark = await this.prismaService.bookmark.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id: id,
        },
      });

      if (deletedBookmark) return { message: 'bookmark succesfully deletd' };
    } else {
      console.error('Invalid request. Email does not match.');
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
}
