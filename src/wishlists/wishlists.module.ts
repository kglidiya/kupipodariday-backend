import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishList } from './entities/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishList, Wish])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
