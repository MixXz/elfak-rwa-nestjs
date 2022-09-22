import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GunAdDto } from './dto/gun-ad.dto';
import { Repository } from 'typeorm';
import { GunAd } from './entities/gun-ad.entity';
import { User } from '../user/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { GunAdDtoUpdate } from './dto/gun-ad-update.dto';
import { GunAdDtoSearch } from './dto/gun-ad-search.dto';
import { Role } from '../enums/role.enum';
import { GunAdDtoPatch } from './dto/gun-ad-patch.dto';
import { Report } from '../report/entities/report.entity';
import { ReportStatus } from '../enums/report-status.enum';
import { UPLOAD_DESTINATION } from '../../helper-config';

@Injectable()
export class GunAdService {
  constructor(
    @InjectRepository(GunAd) private gunAdRepository: Repository<GunAd>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async create(
    gunAdDto: GunAdDto,
    images: Array<Express.Multer.File>,
    user: User,
  ): Promise<GunAd> {
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
  ): Promise<GunAd> {
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

      const fs = require('fs');
      ad.gallery.forEach((img) => {
        fs.unlinkSync(`${UPLOAD_DESTINATION}/${img}`);
      });
    } else {
      imgs = dto.gallery;
    }

    ad.gallery = imgs;

    if (!(await this.gunAdRepository.update(dto.id, ad))) return null;

    return ad;
  }

  public async getBySearch(dto: GunAdDtoSearch): Promise<GunAd[]> {
    const { searchInput, categoryId } = dto;

    let ads: GunAd[] = await this.gunAdRepository.find({
      where: { deleted: false },
      relations: { createdBy: true, category: true },
    });

    if (categoryId) {
      ads = ads.filter((ad: GunAd) => ad.category.id == categoryId);
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

  public async getAll(): Promise<GunAd[]> {
    const ads: GunAd[] = await this.gunAdRepository.find({
      where: { deleted: false },
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
      if (!ad.deleted)
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
      if (!ad.deleted)
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

  public async softDelete(dto: GunAdDtoPatch, userId: number) {
    const { id } = dto;
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user.role !== Role.Admin)
      throw new BadRequestException('Forbidden');

    const ad: GunAd = await this.gunAdRepository.findOne({
      where: { id: id },
      relations: { reports: true },
    });

    if (!ad) throw new BadRequestException('AdNotFound');

    ad.reports.forEach(async (report: Report) => {
      await this.reportRepository.update(report.id, {
        status: ReportStatus.Resolved,
      });
    });

    ad.deleted = true;

    if (!(await this.gunAdRepository.save(ad))) return { success: false };

    return { success: true };
  }

  public async delete(id: number, userId: number) {
    const ad: GunAd = await this.gunAdRepository.findOne({
      where: { id: id },
      relations: { createdBy: true, reports: true },
    });

    if (ad.createdBy.id !== userId) {
      throw new BadRequestException('InvalidUser');
    }

    if (ad.gallery.length > 0) {
      const { gallery } = ad;

      const fs = require('fs');

      gallery.forEach((img) => {
        const path: string = `${UPLOAD_DESTINATION}/${img}`;
        fs.unlinkSync(path);
      });
    }

    if (!(await this.gunAdRepository.delete(id))) return { success: false };

    return { success: true };
  }
}
