import { User } from './src/user/entities/user.entity';
import { DataSourceOptions } from 'typeorm';
import { GunAd } from './src/gun-ad/entities/gun-ad.entity';
import { Category } from './src/category/entities/category.entity';
import { Report } from './src/report/entities/report.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  database: 'rwabaza',
  entities: [User, GunAd, Category, Report],
  synchronize: true,
};
