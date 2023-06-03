import { Length, IsEmail, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner, { cascade: true })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, { cascade: true })
  offers: Offer[];

  @OneToMany(() => WishList, (wishlist) => wishlist.owner, { cascade: true })
  wishlists: WishList[];
}
