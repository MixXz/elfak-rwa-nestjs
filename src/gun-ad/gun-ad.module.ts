import { Module } from '@nestjs/common';
import { GunAdController } from './gun-ad.controller';
import { GunAdService } from './gun-ad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GunAd } from './entities/gun-ad.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GunAd, Category])],
  controllers: [GunAdController],
  providers: [GunAdService],
})
export class GunAdModule {}
