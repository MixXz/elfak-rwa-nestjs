import { Injectable } from '@nestjs/common';
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

  create(categoryDto: CategoryDto) {
    const category = new Category();
    category.name = categoryDto.name;
    category.GunAds = [];

    return this.categoryRepository.save(category);
  }
}
