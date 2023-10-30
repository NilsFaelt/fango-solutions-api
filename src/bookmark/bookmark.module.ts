import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClickModule } from 'src/click/click.module';
import { ContentModule } from 'src/content/content.module';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
  imports: [PrismaModule, ClickModule, ContentModule],
})
export class BookmarkModule {}
