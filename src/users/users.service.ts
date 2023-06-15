import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Register } from './../inferfaces/register.interface';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await this.hashPassword(createUserDto.password);
    createUserDto.password = hash;
    return await this.usersRepository.save(createUserDto);
  }

  async register(createUserDto: Register) {
    const hash = await this.hashPassword(createUserDto.password);
    createUserDto.password = hash;

    return await this.usersRepository.save(createUserDto);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email: email });
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);

    await this.usersRepository.removeOne(id);
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
}
