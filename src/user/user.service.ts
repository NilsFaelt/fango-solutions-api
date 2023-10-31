import { Injectable } from '@nestjs/common';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  public async create(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      console.log('Welcome');
      return existingUser;
    }

    const createdUser = await this.prismaService.user.create({
      data: {
        email: email,
      },
    });
    await this.bookmarkService.generateDefault(createdUser.email);
    return createdUser;
  }
  public async getCount(email: string) {
    try {
      const userCount = await this.prismaService.user.count();
      return { users: { total: userCount } };
    } catch (error) {
      throw new Error('An error occurred while getting user count: ');
    }
  }
}
