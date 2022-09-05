import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public getAll() {
    return this.userRepository.find();
  }

  public create(userDto: UserDto) {
    const user = this.userRepository.create(userDto);
    this.userRepository.save(user);
  }

  public async delete(id: number) {
    return await this.userRepository.delete(id);
  }
}
