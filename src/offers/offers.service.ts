import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UserProfileResponseDto } from 'src/users/dto/user-profile-response.dto';
import { roundUp } from 'src/utils/roundUp';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    user: UserProfileResponseDto,
  ): Promise<Offer> {
    const amountToFixed = roundUp(createOfferDto.amount);

    const item = await this.wishesRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.owner', 'user')
      .where({ id: createOfferDto.itemId })
      .getOne();

    if (!item) {
      throw new NotFoundException('Такой подарок не найден');
    }

    if (item.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете скидываться на собственные подарки',
      );
    }

    if (item.raised === item.price) {
      throw new ForbiddenException(
        'Нельзя скинуться на подарки, на которые уже собраны деньги',
      );
    }

    if (Number(item.raised) + Number(amountToFixed) > item.price) {
      throw new ForbiddenException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    const itemWithRaisedUpdated = await this.wishesRepository.save({
      ...item,
      raised: Number(item.raised) + Number(amountToFixed),
    });
    const offer = await this.offersRepository.create({
      ...createOfferDto,
      amount: amountToFixed,
      itemId: itemWithRaisedUpdated,
      user: user,
    });
    await this.offersRepository.save(offer);

    return offer;
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offersRepository.find({
      relations: [
        'itemId',
        'itemId.owner',
        'itemId.offers',
        'itemId.offers.user',
        'user',
        'user.wishes',
        'user.offers',
      ],
    });
    return offers;
  }

  async findOneById(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id: id },
      relations: [
        'itemId',
        'itemId.owner',
        'itemId.offers',
        'itemId.offers.user',
        'user',
        'user.wishes',
        'user.offers',
      ],
    });
    if (!offer) {
      throw new NotFoundException('Желающие скинуться не найдены');
    }
    return offer;
  }
}
