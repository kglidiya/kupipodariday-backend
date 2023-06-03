import { IsEmail, IsUrl, IsString, IsNumber, IsDate } from 'class-validator';

export class UserProfileResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;
}
