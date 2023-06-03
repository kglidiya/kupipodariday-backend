import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { PassportModule } from '@nestjs/passport/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { Offer } from './offers/entities/offer.entity';
import { WishList } from './wishlists/entities/wishlist.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DB'),
        entities: [User, Wish, Offer, WishList],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
