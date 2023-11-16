import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { ImUser } from 'decorator';
import { ContentInterface } from './types';

@Injectable()
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}
  @Post('/:bookmarkId')
  public async create(
    @ImUser('email') email,
    @Param('bookmarkId') bookmarkId: string,
    @Body('data') data: ContentInterface,
  ) {
    if (!email) throw new HttpException('access denied ', HttpStatus.FORBIDDEN);
    return this.contentService.create(email, bookmarkId, data);
  }
  @Get()
  public async get(
    @ImUser('email') email,
    @Query('bookmarkId') bookmarkId: string,
  ): Promise<ContentInterface[]> {
    if (!email) throw new HttpException('access denied ', HttpStatus.FORBIDDEN);
    return this.contentService.get(email, bookmarkId);
  }
  @Get('/:id')
  public async getbyId(
    @ImUser('email') email,
    @Param('id') id: string,
  ): Promise<ContentInterface> {
    if (!email) throw new HttpException('access denied ', HttpStatus.FORBIDDEN);
    console.log(email, id);
    return this.contentService.getByID(email, id);
  }
  @Delete('/:id')
  //changed param to body
  public async delete(@ImUser('email') email, @Body('id') id: string) {
    if (!email) throw new HttpException('access denied ', HttpStatus.FORBIDDEN);
    return this.contentService.delete(email, id);
  }
  @Patch('/:id')
  public async update(
    @ImUser('email') email,
    @Param('id') id: string,
    @Body('data') data: ContentInterface,
  ): Promise<ContentInterface> {
    if (!email || !id)
      throw new HttpException('access denied ', HttpStatus.FORBIDDEN);

    return this.contentService.update(email, id, data);
  }
}
