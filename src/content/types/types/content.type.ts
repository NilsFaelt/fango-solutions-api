export interface ContentInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  bookmarkId: string;
  userEmail: string;
  title: string;
  text: string;
  todo?: boolean;
  done?: boolean;
}
