import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { CreatWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('/wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('/last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('/top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  findOne(@Param() param: { id: number }): Promise<Wish> {
    return this.wishesService.findOneById(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWishDto: CreatWishDto, @Req() req): Promise<Wish> {
    const owner = req.user;
    return this.wishesService.create(createWishDto, owner);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/copy')
  copy(@Req() req, @Param() param: { id: number }): Promise<Wish> {
    const user = req.user;
    const wishId = param.id;
    return this.wishesService.copy(user, wishId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  update(
    @Body() updateWishDto: UpdateWishDto,
    @Param() param: { id: number },
    @Req() req,
  ): Promise<Wish> {
    return this.wishesService.update(param.id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param() param: { id: number }, @Req() req): Promise<Wish> {
    return this.wishesService.delete(param.id, req.user.id);
  }
}
