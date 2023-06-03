import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    protected configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayload: { sub: number }): Promise<UserProfileResponseDto> {
    const user = this.usersService.findOneById(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
