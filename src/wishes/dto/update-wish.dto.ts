import { PartialType } from '@nestjs/mapped-types';
import { CreatWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreatWishDto) {}