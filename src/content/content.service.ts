import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentInterface } from './types';

@Injectable()
export class ContentService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(
    email: string,
    bookmarkId: string,
    data: {
      title: string;
      text: string;
      todo?: boolean;
    },
  ): Promise<{ message: string; status: number }> {
    console.log(' in prisma', data);
    try {
      const todo = data.todo ? data.todo : false;
      await this.prismaService.content.create({
        data: {
          bookmarkId: bookmarkId,
          userEmail: email,
          title: data.title,
          text: data.text,
          todo: todo,
        },
      });
      return { message: 'Content created', status: HttpStatus.CREATED };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Could not create content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async get(email: string, bookmarkId: string) {
    try {
      return this.prismaService.content.findMany({
        where: {
          bookmarkId: bookmarkId,
          userEmail: email,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Could not fetch content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getByID(email: string, id: string): Promise<ContentInterface> {
    console.log(email, id, ' in prisma');
    try {
      return this.prismaService.content.findUnique({
        where: {
          id: id,
          userEmail: email,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Could not fetch content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(email: string, id: string) {
    try {
      const content = await this.prismaService.content.delete({
        where: {
          id: id,
          userEmail: email,
        },
      });
      if (!content) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }
      return content;
    } catch (error) {
      throw new HttpException(
        'Could not delete content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async update(email: string, id: string, data: ContentInterface) {
    try {
      const todo = data.todo ? data.todo : false;
      const content = await this.prismaService.content.update({
        where: { id: id, userEmail: email },
        data: {
          userEmail: email,
          title: data.title,
          text: data.text,
          todo: todo,
        },
      });
      if (!content) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }
      return content;
    } catch (error) {
      throw new HttpException(
        'Could not update content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
