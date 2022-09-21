import { Controller, Post, Body, Request, UseGuards, Get, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { CategoryService } from './category.service';
import { CategoryDto, CategoryUpdateDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.Admin)
  async create(@Body() dto: CategoryDto) {
    return this.categoryService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  @Roles(Role.Admin)
  async update(@Body() dto: CategoryUpdateDto) {
    return this.categoryService.update(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }
}
