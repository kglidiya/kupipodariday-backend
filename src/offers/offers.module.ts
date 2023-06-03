import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish])],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
