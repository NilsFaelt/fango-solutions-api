import { ContentInterface } from 'src/content';
import { PaginationInterface, BokmarkAnalyticsInterface } from 'src/types';

export interface BookmarkInterface {
  children?: {
    id: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    bookmarkId: string;
  }[];
  analytics?: BokmarkAnalyticsInterface;
  pagination?: PaginationInterface;
  content?: ContentInterface[];
  id: string;
  url: string;
  alias: string | null;
  createdAt: Date;
  userEmail: string;
}
