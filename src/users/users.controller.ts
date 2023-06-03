import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserWishesDto } from 'src/wishes/dto/user-wishes.dto';

@UseGuards(JwtAuthGuard)
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  findOne(@Req() req: any): Promise<UserProfileResponseDto> {
    const { id } = req.user;
    const user = this.usersService.findOneById(id);
    return user;
  }

  @Patch('/me')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<UserProfileResponseDto> {
    const { id } = req.user;
    const userUpdated = await this.usersService.update(updateUserDto, id);
    return userUpdated;
  }

  @Get('/:username')
  async findByUserName(
    @Param() param: { username: string },
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findByUserName(param.username);
    return user;
  }

  @Get('/me/wishes')
  getOwnWishes(@Req() req): Promise<Wish[]> {
    const { id } = req.user;
    return this.usersService.getOwnWishes(id);
  }

  @Get('/:username/wishes')
  findAnotherUserWishes(
    @Param() param: { username: string },
  ): Promise<UserWishesDto[]> {
    return this.usersService.getAnotherUserWishes(param.username);
  }

  @Post('/find')
  findMany(
    @Query() query: { query: string },
  ): Promise<UserProfileResponseDto[]> {
    return this.usersService.findMany(query.query);
  }
}
