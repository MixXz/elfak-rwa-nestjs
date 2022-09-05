import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GunAdDto } from './dto/gun-ad.dto';
import { v4 as uuidv4 } from 'uuid';
import { GunAdService } from './gun-ad.service';

@Controller('gun-ad')
export class GunAdController {
  constructor(private gunAdService: GunAdService){}
    @Get()
    public get() {
        return this.gunAdService.getAll();
    }

    @Post()
    public add(@Body() dto: GunAdDto){
        return this.gunAdService.create(dto);
    }

    @Delete(":id")
    public delete(@Param("id", ParseIntPipe) id: number){
        return this.gunAdService.delete(id);
    }
    
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = uuidv4();
          const ext = file.originalname.split('.').pop();
          cb(null, `${name}.${ext}`);
        },
      }),
    }),
  )
  uploadGallery(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return 'Ok';
  }
}
