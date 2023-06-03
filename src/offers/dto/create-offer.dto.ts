import { IsNumber, IsBoolean } from 'class-validator';
import { Column } from 'typeorm';

export class CreateOfferDto {
  @Column()
  @IsNumber()
  itemId: number;

  @Column('decimal')
  @IsNumber()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
