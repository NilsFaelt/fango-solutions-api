import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClickService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create(bookmarkId: string) {
    try {
      await this.prismaService.click.create({
        data: {
          bookmarkId: bookmarkId,
        },
      });
    } catch (err) {
      console.log('couldnt add click');
    }
  }
  public async increment(bookmarkId: string) {
    try {
      const analytics = await this.prismaService.click.update({
        data: {
          clickCount: {
            increment: 1,
          },
        },
        where: {
          bookmarkId: bookmarkId,
        },
      });
      console.log(analytics);
      return { message: 'analytics added' };
    } catch (err) {
      console.log('couldnt add click');
    }
  }
}
