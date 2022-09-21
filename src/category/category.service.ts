import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto, CategoryUpdateDto } from './dto/category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CategoryDto) {
    const { name } = dto;
    if (!name || name.length === 0)
      throw new BadRequestException('InvalidCategoryName');

    let category = await this.categoryRepository.findOneBy({ name: dto.name });

    if (category) throw new BadRequestException('CategoryAlreadyExists');

    category = this.categoryRepository.create(dto);
    category.GunAds = [];

    return this.categoryRepository.save(category);
  }

  public async update(dto: CategoryUpdateDto) {
    const { id, name } = dto;

    const category: Category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) throw new BadRequestException('InvalidCategory');

    category.name = name;

    return this.categoryRepository.update(id, category);
  }

  public async delete(id: number) {
    const category: Category = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!category) throw new BadRequestException('InvalidCategory');

    return this.categoryRepository.delete(category.id);
  }

  public getAll() {
    return this.categoryRepository.find();
  }
}
