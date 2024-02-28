import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({
      id: id,
    });
  }

  async findByEmail(email: string) {
    const user = this.usersRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: number, userData: UpdateUserDto) {
    const user = this.usersRepository.findOneBy({
      id: id
    })

    if (!user) {
      throw new HttpException('user with this id does not exist', HttpStatus.NOT_FOUND)
    }
    const updatedUser = await this.usersRepository.update(id, userData)

    return updateUser

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
