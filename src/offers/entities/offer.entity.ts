import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  itemId: Wish;

  @Column('decimal')
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
