import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, BookmarkModule],
})
export class UserModule {}
