import { IsUrl, IsString, IsArray, Length, IsOptional } from 'class-validator';

export class CreateWishListDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];

  @IsOptional()
  @IsString()
  @Length(1, 1500)
  description: string;
}
