import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enums/role.enum';
import { UserUpdateDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_CONF } from '../../helper-config';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  public addUser(@Body() dto: UserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('edit-profile')
  @Roles(Role.User, Role.Admin)
  @UseInterceptors(FileInterceptor('image', FILE_CONF))
  public edit(
    @Request() req,
    @Body() dto: UserUpdateDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.editProfile(req.user, dto, image);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  public getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('toggleSave/:id')
  @Roles(Role.User, Role.Admin)
  public async toggleSave(
    @Request() req,
    @Param('id', ParseIntPipe) adId: number,
  ) {
    return this.userService.toggleSave(adId, req.user);
  }

  @Get()
  public getUsers() {
    return this.userService.getAll();
  }

  @Delete(':id')
  public deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
