import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UserWishesDto } from 'src/wishes/dto/user-wishes.dto';

import { hashValue } from 'src/utils/hash';
import { PostgresErrorCode } from 'src/utils/postgres-error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.email')
      .where({ id: id })
      .getOne();
    return user;
  }

  async findByUserName(username: string): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository.findOne({
      relations: {
        wishes: true,
      },
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async findMany(query: string): Promise<UserProfileResponseDto[]> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .where({ username: query })
      .orWhere({ email: query })
      .getMany();
    if (!users.length) {
      throw new NotFoundException('Пользователь не найден');
    }
    return users;
  }

  async findOneWithPassword(username: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({ username: username })
      .getOne();
    return user;
  }

  async getOwnWishes(id: number): Promise<Wish[]> {
    const wishes = await this.usersRepository
      .find({
        relations: [
          'wishes',
          'wishlists',
          'wishes.owner',
          'wishes.offers',
          'wishes.offers.user',
          'wishes.offers.user.wishes',
          'wishes.offers.user.offers',
          'wishes.offers.user.wishlists',
          'wishes.offers.user.wishlists.owner',
          'wishes.offers.user.wishlists.items',
        ],

        where: { id: id },
      })
      .then((user) => {
        return user[0].wishes;
      });

    return wishes;
  }

  async getAnotherUserWishes(username: string): Promise<UserWishesDto[]> {
    const wishes = await this.usersRepository
      .find({
        relations: [
          'wishes',
          'wishes.offers',
          'wishes.offers.itemId',
          'wishes.offers.itemId.owner',
          'wishes.offers.itemId.offers',
          'wishes.offers.user',
          'wishes.offers.user.wishes',
          'wishes.offers.user.wishes.owner',
          'wishes.offers.user.wishes.offers',
          'wishes.offers.user.offers.itemId',
          'wishes.offers.user.offers.itemId.owner',
          'wishes.offers.user.offers.itemId.offers',
          'wishes.offers.user.wishlists',
          'wishes.offers.user.wishlists.owner',
          'wishes.offers.user.wishlists.items',
        ],
        where: { username },
      })
      .then((user) => {
        return user[0].wishes;
      });

    return wishes;
  }

  async create(createUserDto: CreateUserDto): Promise<UserProfileResponseDto> {
    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: await hashValue(createUserDto.password),
      });
      const newUser = await this.usersRepository.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = newUser;

      return rest;
    } catch (error) {
      if (error.code == PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }
  }

  async update(
    updateUserDto: UpdateUserDto,
    id: number,
  ): Promise<UserProfileResponseDto> {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    try {
      const updatedData = await this.usersRepository
        .createQueryBuilder('user')
        .update<User>(User, { ...updateUserDto })
        .where({ id: id })
        .returning([
          'id',
          'username',
          'about',
          'avatar',
          'email',
          'createdAt',
          'updatedAt',
        ])
        .updateEntity(true)
        .execute();
      return updatedData.raw[0];
    } catch (error) {
      if (error.code == PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }
  }
}
