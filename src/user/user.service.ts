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
    const existingUser = await this.prismaService.user.findFirst({
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

  public async delete(email: string) {
    try {
      // Fetch the user and their associated bookmarks
      const user = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
        include: {
          bookmarks: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create an array of promises to delete bookmarks in parallel
      const deleteBookmarkPromises = user.bookmarks.map((bookmark) => {
        return this.bookmarkService.delete(bookmark.id, user.email);
      });

      // Use Promise.all to delete all bookmarks in parallel
      await Promise.all(deleteBookmarkPromises);

      // Now that all bookmarks are deleted, you can delete the user
      const deletedUser = await this.prismaService.user.delete({
        where: {
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
    }
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
