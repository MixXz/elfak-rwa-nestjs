import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GunAdDto } from './dto/gun-ad.dto';
import { Repository } from 'typeorm';
import { GunAd } from './entities/gun-ad.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class GunAdService {
  constructor(
    @InjectRepository(GunAd) private gunAdRepository: Repository<GunAd>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async create(
    gunAdDto: GunAdDto,
    images: Array<Express.Multer.File>,
    user: User,
  ) {
    if (!user) throw new BadRequestException('InvalidUser');

    const gunAd = this.gunAdRepository.create(gunAdDto);

    let paths: string[] = [];
    images.forEach((img) => paths.push(img.path));

    const category: Category | null = await this.categoryRepository.findOneBy({
      id: gunAdDto.categoryID,
    });

    if (!category) throw new BadRequestException('InvalidCategory');

    gunAd.gallery = paths;
    gunAd.createdBy = user;
    gunAd.category = category;

    return this.gunAdRepository.save(gunAd);
  }

  public getAll() {
    return this.gunAdRepository.find();
  }

  public async delete(id: number) {
    return await this.gunAdRepository.delete(id);
  }
}
