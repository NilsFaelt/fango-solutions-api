import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';
import { ImUser } from 'decorator';
import { BookmarkInterface, ChildUrlsInterFace } from './types';

@Injectable()
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private configService: ConfigService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Post()
  public async create(
    @Body('url') url: string,
    @Body('childUrls') childUrls: string[],
    @ImUser('email') email,
  ): Promise<BookmarkDtoWithId> {
    if (!email) throw new HttpException('access denied', HttpStatus.FORBIDDEN);
    return this.bookmarkService.create({ email, url, childUrls });
  }
  @Patch()
  public async patch(
    @Body('url') url: string,
    @Body('childUrls') childUrls: ChildUrlsInterFace[],
    @Body('childUrlsNew') childUrlsNew: string[],
    @Body('id') id: string,
    @ImUser('email') email,
  ): Promise<BookmarkDtoWithId> {
    console.log(childUrls, childUrlsNew, ' in contreoller');

    if (!email) throw new HttpException('access denied', HttpStatus.FORBIDDEN);
    return this.bookmarkService.patch({
      email,
      id,
      url,
      childUrls,
      childUrlsNew,
    });
  }

  @Get()
  public async get(
    @ImUser('email') email: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('limit', ParseIntPipe) limit?: number | null,
  ): Promise<BookmarkInterface[]> {
    if (!email) throw new HttpException('access denied', HttpStatus.FORBIDDEN);
    const bookmarks = await this.bookmarkService.get({
      email: email,
      skip,
      limit,
    });
    return bookmarks;
  }
  @Get('/:id')
  public async getById(
    @ImUser('email') email: string,
    @Param('id') id: string,
  ): Promise<BookmarkInterface> {
    if (!email) throw new HttpException('access denied', HttpStatus.FORBIDDEN);
    return this.bookmarkService.getById({
      email: email,
      id: id,
    });
  }
  @Delete()
  public async delete(@ImUser('email') email: string, @Body('id') id: string) {
    console.log(email, id);
    if (!email) throw new HttpException('access denied', HttpStatus.FORBIDDEN);
    if (!id) throw new HttpException('id not found', HttpStatus.NOT_FOUND);
    return this.bookmarkService.delete(id, email);
  }
}
