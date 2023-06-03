import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(JwtAuthGuard)
@Controller('/offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req): Promise<Offer> {
    const user = req.user;
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get('/:id')
  findOne(@Param() param: { id: number }): Promise<Offer> {
    return this.offersService.findOneById(param.id);
  }
}
