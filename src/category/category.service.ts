import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CategoryDto) {
    if (dto.name === undefined || dto.name === '' || dto.name === null)
      throw new BadRequestException('InvalidCategoryName');

    let category = await this.categoryRepository.findOneBy({ name: dto.name });

    if (category) throw new BadRequestException('CategoryAlreadyExists');

    category = this.categoryRepository.create(dto);
    category.GunAds = [];

    return this.categoryRepository.save(category);
  }

  public getAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category | undefined> {
    return this.categoryRepository.findOneBy({ id: id });
  }
}
