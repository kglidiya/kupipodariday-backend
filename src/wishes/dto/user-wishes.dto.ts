import { WishPartialDto } from './wish-partial.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Offer } from 'src/offers/entities/offer.entity';

export class UserWishesDto extends WishPartialDto {
  @ValidateNested()
  @Type(() => Offer)
  offers: Offer[];
}
