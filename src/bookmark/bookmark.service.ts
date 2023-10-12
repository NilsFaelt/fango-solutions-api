import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';
import { take } from 'rxjs';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  public async add(bookmarkDto: BookmarkDto): Promise<BookmarkDtoWithId> {
    try {
      const bookmark = await this.prismaService.bookmark.create({
        data: {
          url: bookmarkDto.url,
          userEmail: bookmarkDto.userEmail,
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

      return bookmarks;
    } catch (err) {
      console.log(err);
      throw new Error('Couldnt get bookmarks');
    }
  }

  public async delete() {
    console.log('test');
  }
}
