import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GunAdDto } from './dto/gun-ad.dto';
import { Repository } from 'typeorm';
import { GunAd } from './entities/gun-ad.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { GunAdDtoUpdate } from './dto/gun-ad-update.dto';
import { GunAdDtoSearch } from './dto/gun-ad-search.dto';

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

  public async update(
    dto: GunAdDtoUpdate,
    images: Array<Express.Multer.File>,
    user: User,
  ) {
    if (!user) throw new BadRequestException('InvalidUser');

    const ad: GunAd = await this.gunAdRepository.findOne({
      where: { id: dto.id },
      relations: { category: true },
    });

    if (!ad) throw new BadRequestException('GunAdNotFound');

    const category: Category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) throw new BadRequestException('CategoryNotFound');

    ad.title = dto.title;
    ad.price = dto.price;
    ad.brand = dto.brand;
    ad.caliber = dto.caliber;
    ad.description = dto.description;
    ad.category = category;

    let imgs: string[] = [];
    if (images.length !== 0) {
      images.forEach((img) => imgs.push(img.filename));
    } else {
      imgs = dto.gallery;
    }

    ad.gallery = imgs;

    if (!(await this.gunAdRepository.update(dto.id, ad))) return null;

    return ad;
  }

  public async getBySearch(dto: GunAdDtoSearch) {
    const { searchInput, categoryId } = dto;

    let ads: GunAd[];

    if (categoryId) {
      ads = await this.gunAdRepository.find({
        relations: ['category'],
        where: {
          category: {
            id: categoryId,
          },
        },
      });
    } else {
      ads = await this.gunAdRepository.find();
    }

    if (searchInput.length > 0) {
      ads = ads.filter(
        (ad) =>
          ad.title.includes(searchInput) ||
          ad.brand.includes(searchInput) ||
          ad.caliber.includes(searchInput),
      );
    }

    return ads;
  }

  public async getAll() {
    const ads: GunAd[] = await this.gunAdRepository.find({
      relations: { createdBy: true, category: true },
    });

    return ads;
  }

  public async getSingle(id: number, accessUser: User) {
    if (!accessUser) return new BadRequestException('InvalidUser');

    const user: User = await this.userRepository.findOne({
      where: { id: accessUser.id },
      relations: { favourites: true },
    });

    const ad: GunAd = await this.gunAdRepository.findOne({
      where: {
        id: id,
      },
      relations: { createdBy: true, category: true },
    });

    if (!ad) return new BadRequestException('AdNotFound');

    const isSaved: boolean = !!user.favourites.find((fav) => {
      return fav.id === ad.id;
    });

    const data = {
      ...ad,
      isSaved: isSaved,
    };

    return data;
  }

  public async getByUser(id: number) {
    const user: User | null = await this.userRepository.findOne({
      where: { id: id },
      relations: { myAds: true },
    });

    if (!user) throw new BadRequestException('InvalidUser');

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

  public async getByUserSaved(accessUser: User) {
    if (!accessUser) return new BadRequestException('InvalidUser');

    const user: User = await this.userRepository.findOne({
      where: { id: accessUser.id },
      relations: { favourites: true },
    });

    const data = user.favourites.map((ad: GunAd) => {
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

    if (ad.createdBy.id !== userId) {
      throw new BadRequestException('InvalidUser');
    }

    if (!(await this.gunAdRepository.delete(id))) return { success: false };

    return { success: true };
  }
}
