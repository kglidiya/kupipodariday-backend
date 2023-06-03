import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { SigninUserResponseDto } from 'src/users/dto/signin-response.dto';
import { verifyHash } from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.findOneWithPassword(username);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (user && (await verifyHash(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async auth(user: UserProfileResponseDto): Promise<SigninUserResponseDto> {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
