import { Injectable } from '@nestjs/common';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsInterface } from './types/types';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookmarkService: BookmarkService,
  ) {}
  public async get(email: string): Promise<AnalyticsInterface> {
    const bookmarks = await this.bookmarkService.get({ email });

    let totalTodos = 0;
    let totalTodosDone = 0;
    let totalContent = 0;

    bookmarks.forEach((bookmark) => {
      const todos = bookmark.content.filter((t) => t?.todo && !t.done);
      const todosDone = bookmark.content.filter((t) => t?.done);
      totalContent += bookmark?.content.length;
      totalTodos += todos.length;
      totalTodosDone += todosDone.length;
    });

    // Calculate the total number of content

    const bookmarksMapped = bookmarks.map((bookmark) => {
      const todos = bookmark.content.filter((t) => t?.todo && !t.done);
      const todosDone = bookmark.content.filter((t) => t?.done);
      return {
        id: bookmark.id,
        title: bookmark.url,
        totalClick: bookmark.analytics.click.clickCount,
        todos: {
          todo: todos.length,
          done: todosDone.length,
        },
        content: {
          total: bookmark.content.length,
        },
      };
    });

    return {
      bookmark: bookmarksMapped,
      todos: {
        todo: totalTodos,
        done: totalTodosDone,
      },
      content: {
        total: totalContent,
      },
    };
  }
}
