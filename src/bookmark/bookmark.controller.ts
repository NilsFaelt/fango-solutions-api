import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';
import { ImUser } from 'decorator';
import { BookmarkInterface } from './types';

@Injectable()
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private configService: ConfigService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Post()
  public async add(
    @Body('url') url: string,
    @ImUser('email') email,
  ): Promise<BookmarkDtoWithId> {
    console.log(url, email);
    return this.bookmarkService.add({ email, url });
  }
  @Get()
  public async get(
    @ImUser('email') email: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('page', ParseIntPipe) page?: number,
  ): Promise<BookmarkInterface> {
    console.log(email);
    const bookmarks = await this.bookmarkService.get({
      email: email,
      // skip,
      // limit,
    });
    return bookmarks;
  }
  @Delete()
  public async delete() {
    return this.bookmarkService.delete();
  }
}
