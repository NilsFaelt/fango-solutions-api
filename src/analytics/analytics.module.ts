import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';

@Module({
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  imports: [PrismaModule, BookmarkModule],
})
export class AnalyticsModule {}
