import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ContentService],
  controllers: [ContentController],
  imports: [PrismaModule],
  exports: [ContentService],
})
export class ContentModule {}
