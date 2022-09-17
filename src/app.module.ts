import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GunAdModule } from './gun-ad/gun-ad.module';
import { CategoryModule } from './category/category.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ROOT_PATH } from '../helper-config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: ROOT_PATH,
      renderPath: '/'
    }),
    GunAdModule,
    UserModule,
    CategoryModule,
    ReportModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
