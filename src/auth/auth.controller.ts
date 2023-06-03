import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { SigninUserResponseDto } from 'src/users/dto/signin-response.dto';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req): Promise<SigninUserResponseDto> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
