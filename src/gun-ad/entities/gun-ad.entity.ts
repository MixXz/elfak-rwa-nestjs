import { Report } from '../../report/entities/report.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @Column({ type: 'boolean', default: false })
  public deleted: boolean;

  @Column('simple-array')
  public gallery: string[];

  @OneToMany(() => Report, (report: Report) => report.gunAd)
  public reports: Report[];

  @ManyToOne(() => User, (user: User) => user.myAds, { onDelete: 'CASCADE' })
  public createdBy: User;

  @ManyToOne(() => Category, (category: Category) => category.GunAds, {
    onDelete: 'CASCADE',
  })
  public category: Category;

  @ManyToMany(() => User, (user: User) => user.favourites)
  @JoinTable({ name: 'adFavourites' })
  public users: User[];
}
