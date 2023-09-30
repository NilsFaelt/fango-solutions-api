import { Controller, Injectable, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Controller('bookmark')
export class BookmarkController {
  constructor(private configService: ConfigService) {}

  @Post()
  public async add() {
    console.log(this.configService.get('TEST'));
  }
}
