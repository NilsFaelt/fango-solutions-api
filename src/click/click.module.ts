import { Module } from '@nestjs/common';
import { ClickService } from './click.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClickController } from './click.controller';

@Module({
  providers: [ClickService],
  imports: [PrismaModule],
  exports: [ClickService],
  controllers: [ClickController],
})
export class ClickModule {}
