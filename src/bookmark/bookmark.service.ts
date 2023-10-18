import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  public async add(data: {
    email: string;
    url: string;
    data?: { urls: string[] };
  }): Promise<BookmarkDtoWithId> {
    console.log(data, ' in prisma');
    try {
      const bookmark = await this.prismaService.bookmark.create({
        data: {
          url: data.url,
          userEmail: data.email,
        },
      });
      if (data.data.urls[0]) {
        await this.addChildUrls(bookmark.id, data.data);
      }
      const { deletedAt, createdAt, updatedAt, ...rest } = bookmark;
      return rest;
    } catch (err) {
      throw new Error('Failed to add bookmark');
    }
  }

  public async addChildUrls(id: string, data: { urls: string[] }) {
    try {
      const childCreatePromises = data.urls.map(async (url) => {
        await this.prismaService.bookmarkChildren.create({
          data: {
            url,
            bookmarkId: id,
          },
        });
      });

      const addedChildren = await Promise.all(childCreatePromises);
      console.log(addedChildren, 'in service');
    } catch (err) {
      console.log('couldnt add child urls');
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
  }): Promise<any> {
    try {
      const bookmarks = await this.prismaService.bookmark.findMany({
        where: {
          userEmail: email,
          deletedAt: {
            equals: null,
          },
        },
        skip: skip,
        take: limit ? limit : 10000,
      });
      const filteredBookmarks = bookmarks?.map((bookmark) => {
        const { deletedAt, updatedAt, ...rest } = bookmark;
        return rest;
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
