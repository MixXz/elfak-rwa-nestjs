import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.Admin)
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }
}
