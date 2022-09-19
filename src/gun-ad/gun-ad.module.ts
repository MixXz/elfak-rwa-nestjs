import { Module } from '@nestjs/common';
import { GunAdController } from './gun-ad.controller';
import { GunAdService } from './gun-ad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GunAd } from './entities/gun-ad.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { Report } from '../report/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GunAd, Category, User, Report])],
  controllers: [GunAdController],
  providers: [GunAdService],
})
export class GunAdModule {}
