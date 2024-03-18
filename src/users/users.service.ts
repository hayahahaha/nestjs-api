import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FilesService } from '../files/files.services'
import { throws } from 'assert';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private filesService: FilesService,
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

  async findById(id: number) {
    const user = this.usersRepository.findOneBy({
      id: id,
    });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = this.usersRepository.findOneBy({
      email,
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
      id: id,
    });

    if (!user) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.usersRepository.update(id, userData);

    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename)

    const user = await this.usersRepository.findOneBy({
      id: userId
    })

    if (!user) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.usersRepository.update(userId, {
      avatar: avatar
    })

    return avatar
  }
}
