import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';
import { take } from 'rxjs';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  public async add(data: {
    email: string;
    url: string;
  }): Promise<BookmarkDtoWithId> {
    console.log(data, ' in prisma');
    try {
      const bookmark = await this.prismaService.bookmark.create({
        data: {
          url: data.url,
          userEmail: data.email,
        },
      });
      const { deletedAt, createdAt, updatedAt, ...rest } = bookmark;
      return rest;
    } catch (err) {
      throw new Error('Failed to add bookmark');
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

  public async delete() {
    console.log('test');
  }
}
