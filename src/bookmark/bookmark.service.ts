import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';

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

  public async get() {
    console.log('test');
  }

  public async delete() {
    console.log('test');
  }
}
