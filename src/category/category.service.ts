import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  create(categoryDto: CategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
