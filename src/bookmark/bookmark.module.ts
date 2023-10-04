import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [],
  imports: [PrismaModule],
})
export class BookmarkModule {}
