import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClickInterface } from './types';

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
    console.log(bookmarkId, ' in service');
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
  public async get(bookmarkId: string): Promise<ClickInterface> {
    try {
      const click = await this.prismaService.click.findUnique({
        where: {
          bookmarkId: bookmarkId,
        },
      });
      return click;
    } catch (err) {
      console.log('could npt find click');
    }
  }
}
