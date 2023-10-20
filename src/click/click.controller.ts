import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { ClickService } from './click.service';

@Injectable()
@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) {}
  @Post('increment')
  public async increment(@Body('bookmarkId') bookmarkId: string): Promise<any> {
    return await this.clickService.increment(bookmarkId);
  }
}
