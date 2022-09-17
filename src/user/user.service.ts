import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SALT_ROUNDS } from '../../helper-config';
import * as bcrypt from 'bcrypt';
import { GunAd } from '../gun-ad/entities/gun-ad.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(GunAd) private gunAdRepository: Repository<GunAd>,
  ) {}

  public async create(userDto): Promise<User | undefined> {
    const { email, password } = userDto;

    if (!email || !password) {
      throw new BadRequestException('MissingFields');
    }

    if (await this.findOne(email)) {
      throw new BadRequestException('EmailAlreadyRegistered');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User();
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.phone = userDto.phone;
    user.address = userDto.address;
    user.email = email;
    user.password = hashedPassword;
    user.favourites = [];

    return this.userRepository.save(user);
  }

  public async toggleSave(adId: number, accessUser: User) {
    if (!accessUser) throw new BadRequestException('InvalidUser');

    const user: User = await this.userRepository.findOne({
      where: { id: accessUser.id },
      relations: { favourites: true },
    });

    const isAlreadySaved = user.favourites.find(
      (favourite) => favourite.id === adId,
    );
    let ad: GunAd;
    if (!isAlreadySaved) {
      ad = await this.gunAdRepository.findOne({
        where: { id: adId },
      });
    }

    user.favourites = isAlreadySaved
      ? user.favourites.filter((favourite) => favourite.id !== adId)
      : [...user.favourites, ad];

    if (!(await this.userRepository.save(user))) return { success: false };

    return { success: true };
  }

  public async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email: email });
  }

  public getAll() {
    return this.userRepository.find();
  }

  public async delete(id: number) {
    return await this.userRepository.delete(id);
  }
}
