import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto, BookmarkDtoWithId } from './dto';
import { ImUser } from 'decorator';

@Injectable()
@Controller('bookmark')
export class BookmarkController {
  constructor(
    private configService: ConfigService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Post()
  public async add(
    @Body() bookmarkDto: BookmarkDto,
  ): Promise<BookmarkDtoWithId> {
    return this.bookmarkService.add(bookmarkDto);
  }
  @Get()
  public async get(
    // @ImUser('email') email: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    console.log(limit, skip);
    return this.bookmarkService.get({
      email: 'nils@gmail.com',
      skip,
      limit,
    });
  }
  @Delete()
  public async delete() {
    return this.bookmarkService.delete();
  }
}
