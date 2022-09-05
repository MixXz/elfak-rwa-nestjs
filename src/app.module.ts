import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GunAdModule } from './gun-ad/gun-ad.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), GunAdModule, UserModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
