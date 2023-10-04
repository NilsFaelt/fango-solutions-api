import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Post,
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
  public async get() {
    return this.bookmarkService.get();
  }
  @Delete()
  public async delete() {
    return this.bookmarkService.delete();
  }
}
