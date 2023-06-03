import { IsInt, Length, IsUrl } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column('decimal')
  price: number;

  @Column('decimal', { default: 0 })
  raised: number;

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.itemId, { cascade: true })
  offers: Offer[];
}
