import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';
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
    limit = undefined,
  }: {
    email: string;
    skip?: number;
    limit?: number;
  }): Promise<BookmarkInterface[]> {
    try {
      const bookmarks = await this.prismaService.bookmark.findMany({
        where: {
          userEmail: email,
          deletedAt: {
            equals: null,
          },
        },
        include: {
          children: true,
        },

        skip: skip,
        take: limit ? limit : 10000,
      });
      // fix click namening and filtering, fix so its not a array
      const filteredBookmarks = bookmarks?.map((bookmark) => {
        const { deletedAt, updatedAt, ...rest } = bookmark;
        return { ...rest };
      });

      return filteredBookmarks;
    } catch (err) {
      console.log(err);
      throw new Error('Couldnt get bookmarks');
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
      console.log(deletedBookmark);
      if (deletedBookmark) return { message: 'bookmark succesfully deletd' };
    } else {
      console.error('Invalid request. Email does not match.');
    }
  }
}
