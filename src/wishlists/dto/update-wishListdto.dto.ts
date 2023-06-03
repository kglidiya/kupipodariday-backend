import { PartialType } from '@nestjs/mapped-types';
import { CreateWishListDto } from './create-wishList-dto.dto';

export class UpdateWishListDto extends PartialType(CreateWishListDto) {}
