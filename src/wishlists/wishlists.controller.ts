import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishListDto } from './dto/create-wishList-dto.dto';
import { UpdateWishListDto } from './dto/update-wishListdto.dto';
import { WishList } from './entities/wishlist.entity';

@UseGuards(JwtAuthGuard)
@Controller('/wishlistlists')
export class WishlistsController {
  constructor(private wishListService: WishlistsService) {}

  @Post()
  create(
    @Body() createWishListDto: CreateWishListDto,
    @Req() req,
  ): Promise<WishList> {
    const user = req.user;
    return this.wishListService.create(createWishListDto, user);
  }

  @Patch('/:id')
  update(
    @Body() updateWishListDto: UpdateWishListDto,
    @Param() param: { id: number },
    @Req() req,
  ): Promise<WishList> {
    return this.wishListService.update(param.id, updateWishListDto, req.user);
  }

  @Get('/:id')
  findById(@Param() param: { id: number }): Promise<WishList> {
    return this.wishListService.findById(param.id);
  }

  @Get()
  findAll(): Promise<WishList[]> {
    return this.wishListService.findAll();
  }

  @Delete('/:id')
  delete(@Param() param: { id: number }, @Req() req): Promise<WishList> {
    return this.wishListService.delete(param.id, req.user);
  }
}
