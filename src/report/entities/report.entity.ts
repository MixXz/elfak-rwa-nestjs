import { ReportStatus } from '../../enums/report-status.enum';
import { GunAd } from '../../gun-ad/entities/gun-ad.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', default: ReportStatus.Pending })
  public status: ReportStatus;

  //vise reportova za jedan oglas
  @ManyToOne(() => GunAd, (ad: GunAd) => ad.reports)
  public gunAd: GunAd;
}
