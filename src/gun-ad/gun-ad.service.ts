import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GunAdDto } from './dto/gun-ad.dto';
import { Repository } from 'typeorm';
import { GunAd } from './entities/gun-ad.entity';

@Injectable()
export class GunAdService {
  constructor(
    @InjectRepository(GunAd) private gunAdRepository: Repository<GunAd>,
  ) {}
  
  public getAll() {
    return this.gunAdRepository.find();
  }

  public create(gunAdDto: GunAdDto) {
    const gunAd = this.gunAdRepository.create(gunAdDto);
    this.gunAdRepository.save(gunAd);
  }

  public async delete(id: number) {
    return await this.gunAdRepository.delete(id);
  }
}
