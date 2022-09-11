import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GunAdDto } from './dto/gun-ad.dto';
import { v4 as uuidv4 } from 'uuid';
import { GunAdService } from './gun-ad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { IMG_COUNT } from '../../helper-config';

export const fileConf = {
  storage: diskStorage({
    destination: 'C:/STORAGE/rwa-angular/src/assets',
    filename: (req, file, cb) => {
      const name = uuidv4();
      const ext = file.originalname.split('.').pop();
      cb(null, `${name}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new BadRequestException('InvalidImageType'), false);
    }
    cb(null, true);
  },
};

@Controller('gun-ad')
export class GunAdController {
  constructor(private gunAdService: GunAdService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(FilesInterceptor('images', IMG_COUNT, fileConf))
  public create(
    @Body() dto: GunAdDto,
    @Request() req,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    return this.gunAdService.create(dto, images, req.user);
  }

  @Get()
  public get() {
    return this.gunAdService.getAll();
  }

  @Delete(':id')
  public delete(@Param('id', ParseIntPipe) id: number) {
    return this.gunAdService.delete(id);
  }
}
