import { ContentInterface } from 'src/content';
import { PaginationInterface, BokmarkAnalyticsInterface } from 'src/types';

export interface ChildInterface {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  bookmarkId: string;
}
export interface BookmarkInterface {
  children?: ChildInterface[];
  analytics?: BokmarkAnalyticsInterface;
  pagination?: PaginationInterface;
  content?: ContentInterface[];
  userEmail: string;
  id: string;
  url: string;
  alias: string;
  createdAt: Date;
}
