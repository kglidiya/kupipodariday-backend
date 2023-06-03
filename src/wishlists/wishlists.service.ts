import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WishList } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CreateWishListDto } from './dto/create-wishList-dto.dto';
import { UpdateWishListDto } from './dto/update-wishListdto.dto';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishListRepository: Repository<WishList>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(
    createWishListDto: CreateWishListDto,
    owner: UserProfileResponseDto,
  ): Promise<WishList> {
    const wishes = await this.wishRepository.findBy({
      id: Any(createWishListDto.itemsId),
    });

    const wishList = await this.wishListRepository.create({
      ...createWishListDto,
      items: wishes,
      owner: owner,
    });
    return await this.wishListRepository.save(wishList);
  }

  async update(
    id: number,
    updateWisListhDto: UpdateWishListDto,
    owner: UserProfileResponseDto,
  ): Promise<WishList> {
    const wishListToUpdate = await this.wishListRepository.findOne({
      where: { id: id },
    });
    if (!wishListToUpdate) {
      throw new NotFoundException('Список желаний не найден');
    }

    if (wishListToUpdate.owner.id !== owner.id) {
      throw new ForbiddenException(
        'Редактировать можно только свои подборки подарков',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, image, description, ...rest } = updateWisListhDto;

    const wishes = await this.wishRepository.findBy({
      id: Any(updateWisListhDto.itemsId),
    });

    const wishListUpdated = await this.wishListRepository.create({
      ...wishListToUpdate,
      name,
      image,
      description: description || wishListToUpdate.description,
      items: wishes,
      owner,
    });

    return await this.wishListRepository.save(wishListUpdated);
  }

  async findAll(): Promise<WishList[]> {
    const wishLists = await this.wishListRepository
      .createQueryBuilder('wishlist')
      .leftJoinAndSelect('wishlist.owner', 'user')
      .leftJoinAndSelect('wishlist.items', 'wish')
      .getMany();
    return wishLists;
  }

  async findById(id: number): Promise<WishList> {
    const wishList = await this.wishListRepository
      .createQueryBuilder('wishlist')
      .leftJoinAndSelect('wishlist.owner', 'user')
      .leftJoinAndSelect('wishlist.items', 'wish')
      .where({ id: id })
      .getOne();
    if (!wishList) {
      throw new NotFoundException('Список желаний не найден');
    }
    return wishList;
  }

  async delete(id: number, owner: UserProfileResponseDto): Promise<any> {
    const wishListToDelete = await this.wishListRepository.findOne({
      where: { id },
    });

    if (!wishListToDelete) {
      throw new NotFoundException('Список желаний не существует');
    }
    if (wishListToDelete.owner.id !== owner.id) {
      throw new ForbiddenException(
        'Удалять можно только свои подборки подарков',
      );
    }

    const wishListDeleted = await this.wishListRepository
      .createQueryBuilder('wishlist')
      .delete()
      .where({ id: id })
      .returning('*')
      .execute();
    return wishListDeleted.raw[0];
  }
}
