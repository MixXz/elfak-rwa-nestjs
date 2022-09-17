import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GunAdDto } from './dto/gun-ad.dto';
import { GunAdService } from './gun-ad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { FILE_CONF, IMG_COUNT } from '../../helper-config';
import { GunAdDtoUpdate } from './dto/gun-ad-update.dto';
import { GunAdDtoSearch } from './dto/gun-ad-search.dto';
import { GunAdDtoPatch } from './dto/gun-ad-patch.dto';

@Controller('gun-ad')
export class GunAdController {
  constructor(private gunAdService: GunAdService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(FilesInterceptor('images', IMG_COUNT, FILE_CONF))
  public create(
    @Body() dto: GunAdDto,
    @Request() req,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.gunAdService.create(dto, images, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(FilesInterceptor('images', IMG_COUNT, FILE_CONF))
  public update(
    @Body() dto: GunAdDtoUpdate,
    @Request() req,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.gunAdService.update(dto, images, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('myAds')
  @Roles(Role.User, Role.Admin)
  public getByUser(@Request() req) {
    return this.gunAdService.getByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('savedAds')
  @Roles(Role.User, Role.Admin)
  public getByUserSaved(@Request() req) {
    return this.gunAdService.getByUserSaved(req.user);
  }

  @Get('search')
  public search(@Query() dto: GunAdDtoSearch) {
    return this.gunAdService.getBySearch(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @Roles(Role.User, Role.Admin)
  public getSingle(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.gunAdService.getSingle(id, req.user);
  }

  @Get()
  public get() {
    return this.gunAdService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('softDelete')
  @Roles(Role.Admin)
  public softDelete(@Body() dto: GunAdDtoPatch, @Request() req) {
    return this.gunAdService.softDelete(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  public delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.gunAdService.delete(id, req.user.id);
  }
}
