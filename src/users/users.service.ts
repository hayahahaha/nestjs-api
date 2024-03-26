import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FilesService } from '../files/files.services'
import { UserSearchService } from './userSearch.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userSearchService: UserSearchService,
    private filesService: FilesService,
  ) { }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    await this.userSearchService.indexUser(newUser)
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
    if (updatedUser) {
      await this.userSearchService.update(updatedUser)
      return updatedUser;
    }
  }

  async remove(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND
      )
    }
    await this.userSearchService.remove(id)
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename)

    const user = await this.findById(userId)

    if (!user) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.avatar) {
      await this.usersRepository.update(userId, {
        avatar: null
      })
      await this.filesService.deletePublic(user.avatar.id)
    }

    await this.usersRepository.update(userId, {
      avatar: avatar
    })

    return avatar
  }

  async deleteAvatar(userId: number) {
    const user = await this.findById(userId);
    const fileId = user.avatar.id
    if (fileId) {
      await this.usersRepository.update(userId, {
        avatar: null
      })
      await this.filesService.deletePublic(fileId);
    }

  }

  searchUser(text: string) {
    return this.userSearchService.searchUser(text)
  }

}
