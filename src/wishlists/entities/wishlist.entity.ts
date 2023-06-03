import { Length, IsUrl, IsOptional } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column({ default: '' })
  @IsOptional()
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, { onDelete: 'CASCADE' })
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  @JoinColumn({ name: 'user_id' })
  owner: User;
}
