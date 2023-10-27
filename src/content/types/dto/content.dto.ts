import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class ContentDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  text: string;
  @IsBoolean()
  todo?: boolean;
  @IsBoolean()
  done?: boolean;
}
