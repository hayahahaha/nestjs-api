import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, Transaction } from 'typeorm';
import { User } from './entities/user.entity';
import { FilesService } from '../files/files.services';
import { UserSearchService } from './userSearch.service';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userSearchService: UserSearchService,
    private filesService: FilesService,
    private dataSource: DataSource,
  ) {}

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    await this.userSearchService.indexUser(newUser);
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
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.usersRepository.update(id, userData);

    if (updatedUser) {
      await this.userSearchService.update(user);
      return updatedUser;
    }
  }

  async remove(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userSearchService.remove(id);
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );

    const user = await this.findById(userId);

    if (!user) {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.avatar) {
      await this.usersRepository.update(userId, {
        avatar: null,
      });
      await this.filesService.deletePublic(user.avatar.id);
    }

    await this.usersRepository.update(userId, {
      avatar: avatar,
    });

    return avatar;
  }

  async deleteAvatar(userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    const user = await this.findById(userId);
    const fileId = user.avatar.id;
    if (!fileId) {
      return;
    }

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.update(User, userId, {
        avatar: null,
      });
      await this.usersRepository.update(userId, {
        avatar: null,
      });
      await this.filesService.deletePublic(fileId);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  searchUser(text: string) {
    return this.userSearchService.searchUser(text);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findById(userId);

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const isRefreshTokenMatched = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatched) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
