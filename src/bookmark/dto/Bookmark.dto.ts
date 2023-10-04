import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
export class BookmarkDto {
  @IsNotEmpty()
  @IsString()
  url: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  userEmail: string;
}

class BookmarkId {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}

export class BookmarkDtoWithId extends IntersectionType(
  BookmarkDto,
  BookmarkId,
) {}
