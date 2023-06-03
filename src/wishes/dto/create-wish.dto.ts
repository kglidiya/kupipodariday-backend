import { IsUrl, IsString, IsNumber, Length, IsOptional } from 'class-validator';

export class CreatWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  @Length(0, 1024)
  description: string;
}
