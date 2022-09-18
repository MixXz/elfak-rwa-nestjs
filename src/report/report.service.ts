import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { GunAd } from '../gun-ad/entities/gun-ad.entity';
import { Report } from './entities/report.entity';
import { ReportDto } from './dto/report.dto';
import { ReportStatus } from '../enums/report-status.enum';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    @InjectRepository(GunAd) private gunAdRepository: Repository<GunAd>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async create(dto: ReportDto) {
    const { gunAdId, text } = dto;

    const ad: GunAd = await this.gunAdRepository.findOne({
      where: { id: gunAdId, deleted: false },
      relations: { createdBy: true, category: true },
    });

    if(!ad) throw new BadRequestException('AdNotFound');

    const report: Report = new Report();
    report.gunAd = ad;
    report.text = text;

    return this.reportRepository.save(report);
  }

  // public async update(id: number) {
  //   const report: Report = await this.reportRepository.findOne({where: {id: id}});

  //   if(!report) throw new BadRequestException('ReportNotFound');

  //   report.status = ReportStatus.Resolved;

  //   return this.reportRepository.update(report.id, report);
  // }

  public async delete(id: number){
    const report: Report = await this.reportRepository.findOne({where: {id: id}});

    if(!report) throw new BadRequestException('ReportNotFound');

    return this.reportRepository.delete(report.id);
  }

  public getAll() {
    return this.reportRepository.find({
      where: { status: ReportStatus.Pending },
      relations: { gunAd: true },
    });
  }
}
