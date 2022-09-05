import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class GunAd {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', nullable: false })
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'text', nullable: false })
  public brand: string;

  @Column({ type: 'text', nullable: false })
  public caliber: string;

  @Column({ type: 'text', nullable: false })
  public price: number;

  @Column({ type: 'text' })
  public gallery: string[];

  @Column({ type: 'text', nullable: false })
  public address: string;

  //vise oglasa jedan korisnik (pripadaju samo njemu)
  @ManyToOne(() => User, (user: User) => user.myAds)
  public createdBy: User;

  //vise oglasa jedna kateogirja 
  @ManyToOne(() => Category, (category: Category) => category.GunAds)
  public category: Category;

  // vise oglasa mogu imati vise korisnika
  @ManyToMany(() => User, (user: User) => user.favourites)
  @JoinTable({ name: 'adFavourites' })
  public users: User[];
}
