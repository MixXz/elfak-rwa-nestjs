import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GunAd } from '../../gun-ad/entities/gun-ad.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', nullable: false })
  public name: string;

  //jedna kategorija vise oglasa
  @OneToMany(() => GunAd, (ad: GunAd) => ad.category)
  public GunAds: GunAd[];
}
