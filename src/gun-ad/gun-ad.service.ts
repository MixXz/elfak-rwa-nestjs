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
    @InjectRepository(User) private userRepository: Repository<User>,
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
    if (images) {
      images.forEach((img) => paths.push(img.filename));
    } else {
      paths = null;
    }

    const category: Category | null = await this.categoryRepository.findOneBy({
      id: gunAdDto.categoryId,
    });

    if (!category) throw new BadRequestException('InvalidCategory');

    gunAd.gallery = paths;
    gunAd.createdBy = user;
    gunAd.category = category;

    return this.gunAdRepository.save(gunAd);
  }

  public async getAll() {
    const arr: GunAd[] = await this.gunAdRepository.find({
      relations: { createdBy: true, category: true },
    });

    arr.map((el) => {
      let a: string = <string>(<unknown>el.gallery);
      a = a.slice(2);
      a = a.slice(0, -2);
      const arr = a.split('","');

      el.gallery = arr;

      return el;
    });

    return arr;
  }

  public getSingle(id: number) {
    return this.gunAdRepository.findOne({
      where: {
        id: id,
      },
      relations: { createdBy: true, category: true },
    });
  }

  public async getByUser(id: number) {
    const user: User | null = await this.userRepository.findOne({
      where: { id: id },
      relations: { myAds: true },
    });

    if (!user) throw new BadRequestException('InvalidUser');
    console.log(user);
    console.log(user.myAds);

    user.myAds.map((el) => {
      let a: string = <string>(<unknown>el.gallery);
      a = a.slice(2);
      a = a.slice(0, -2);
      const arr = a.split('","');

      el.gallery = arr;

      return el;
    });

    const data = user.myAds.map((ad: GunAd) => {
      return {
        ...ad,
        createdBy: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          imagePath: user.imagePath,
          address: user.address,
        },
      };
    });

    return data;
  }

  public async delete(id: number, userId: number) {
    const ad: GunAd = await this.gunAdRepository.findOne({
      where: { id: id },
      relations: { createdBy: true },
    });

    if(ad.createdBy.id !== userId) {
      throw new BadRequestException('InvalidUser');
    }

    if (!(await this.gunAdRepository.delete(id))) return { success: false };

    return { success: true };
  }
}
