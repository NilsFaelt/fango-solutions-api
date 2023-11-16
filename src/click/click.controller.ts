import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { ClickService } from './click.service';
import { ClickInterface } from './types';

@Injectable()
@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) {}
  @Post('increment')
  public async increment(@Body('bookmarkId') bookmarkId: string) {
    return await this.clickService.increment(bookmarkId);
  }
  @Get('/:bookmarkId')
  public async get(
    @Body('bookmarkId') bookmarkId: string,
  ): Promise<ClickInterface> {
    return await this.clickService.get(bookmarkId);
  }
}
