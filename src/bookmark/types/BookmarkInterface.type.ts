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
  Click?: BokmarkAnalyticsInterface[];
  pagination?: PaginationInterface;
  id: string;
  url: string;
  createdAt: Date;
  userEmail: string;
}
