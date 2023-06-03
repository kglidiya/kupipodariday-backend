import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { CreatWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { roundUp } from 'src/utils/roundUp';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(
    createWishDto: CreatWishDto,
    owner: UserProfileResponseDto,
  ): Promise<Wish> {
    const priceToFixed = roundUp(createWishDto.price);
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      price: priceToFixed,
      owner: owner,
    });
    await this.wishesRepository.save(wish);
    return wish;
  }

  async findLast(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  async findTop(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
      order: { copied: 'DESC', createdAt: 'DESC' },
      take: 20,
    });
    return wishes;
  }

  async findOneById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  async copy(user: UserProfileResponseDto, wishId: number): Promise<any> {
    const wishToCopy = await this.wishesRepository.findOne({
      where: { id: wishId },
    });
    if (!wishToCopy) {
      throw new NotFoundException('Подарок не найлен');
    }
    const wish = await this.wishesRepository.create({
      ...wishToCopy,
      owner: user,
    });
    await this.wishesRepository.save(wish);
    await this.wishesRepository.increment({ id: wishId }, 'copied', 1);
    return this.wishesRepository.findOne({ where: { id: wishId } });
  }

  async update(
    wishId: number,
    updateWishDto: UpdateWishDto,
    ownerId: number,
  ): Promise<Wish> {
    const wish = await await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найлен');
    }
    const raised = wish.raised;
    if (wish.owner.id !== ownerId) {
      throw new ForbiddenException('Нельзя изменять чужие подарки');
    }
    const priceToFixed = roundUp(updateWishDto.price);
    if (updateWishDto.price) {
      if (Number(raised) === 0) {
        const updatedData = await this.wishesRepository
          .createQueryBuilder('wish')
          .update<Wish>(Wish, { ...updateWishDto, price: priceToFixed })
          .where({ id: wishId })
          .returning('*')
          .updateEntity(true)
          .execute();
        return updatedData.raw[0];
      } else
        throw new ForbiddenException(
          'Hельзя изменять стоимость подарка, если уже есть желающие скинуться',
        );
    }
    const updatedData = await this.wishesRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.owner', 'user')
      .update<Wish>(Wish, { ...updateWishDto })
      .where({ id: wishId })
      .returning('*')
      .updateEntity(true)
      .execute();
    return updatedData.raw[0];
  }

  async delete(wishId: number, ownerId: number): Promise<Wish> {
    const wishToDelete = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });
    if (!wishToDelete) {
      throw new NotFoundException('Подарок не найлен');
    }
    if (wishToDelete.owner.id !== ownerId) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }
    await this.wishesRepository
      .createQueryBuilder('wish')
      .delete()
      .where({ id: wishId })
      .execute();
    return wishToDelete;
  }
}
