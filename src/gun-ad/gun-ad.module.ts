import { Module } from '@nestjs/common';
import { GunAdController } from './gun-ad.controller';
import { GunAdService } from './gun-ad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GunAd } from './entities/gun-ad.entity';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GunAd, Category, User])],
  controllers: [GunAdController],
  providers: [GunAdService],
})
export class GunAdModule {}
