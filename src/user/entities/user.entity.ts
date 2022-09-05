import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileType } from '../../enums/profileType.enum';
import { GunAd } from '../../gun-ad/entities/gun-ad.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', nullable: false })
  public firstName: string;

  @Column({ type: 'text', nullable: false })
  public lastName: string;

  @Column({ type: 'text', nullable: false, unique: true })
  public email: string;

  @Column({ type: 'text', nullable: false })
  public password: string;

  @Column({ type: 'text', nullable: false })
  public phone: string;

  @Column({ type: 'text', nullable: false, default: ProfileType.USER })
  public type: string;

  //jedan korinsik moze da kreira/ima vise oglasa
  @OneToMany(() => GunAd, (ad: GunAd) => ad.createdBy)
  public myAds: GunAd[];

  // vise korinsika mogu imati više oglasa kao favorite
  @ManyToMany(() => GunAd, (ad: GunAd) => ad.users, { onDelete: 'CASCADE' })
  public favourites: GunAd[];

  
}