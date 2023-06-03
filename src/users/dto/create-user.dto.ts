import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsUrl,
  IsString,
  IsOptional,
  Length,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  @Transform(({ value }) =>
    value === ''
      ? (value = 'Пока ничего не рассказал о себе')
      : (value = value),
  )
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
