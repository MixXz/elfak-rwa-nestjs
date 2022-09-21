import { ReportStatus } from '../../enums/report-status.enum';
import { GunAd } from '../../gun-ad/entities/gun-ad.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text', default: ReportStatus.Pending })
  public status: ReportStatus;

  @Column({ type: 'text', nullable: true })
  public text: string;

  @ManyToOne(() => GunAd, (ad: GunAd) => ad.reports, { onDelete: 'CASCADE' })
  public gunAd: GunAd;
}
