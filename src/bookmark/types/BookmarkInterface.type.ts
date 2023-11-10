import { ContentInterface } from 'src/content';
import { PaginationInterface, BokmarkAnalyticsInterface } from 'src/types';

export interface BookmarkInterface {
  id: string;
  url: string;
  alias?: string | null;
  createdAt: Date;
  userEmail: string;
  children?: ChildInterface[];
  analytics?: BokmarkAnalyticsInterface;
  pagination?: PaginationInterface;
  content?: ContentInterface[];
}

export interface ChildInterface {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  bookmarkId: string;
}
