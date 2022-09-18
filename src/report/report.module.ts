import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { User } from '../user/entities/user.entity';
import { GunAd } from '../gun-ad/entities/gun-ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, GunAd])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
