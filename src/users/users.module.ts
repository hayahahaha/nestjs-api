import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from 'src/files/file.modules';
import { UserSearchService } from './userSearch.service';
import { SearchModule } from './../search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    FileModule,
    SearchModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSearchService],
  exports: [UsersService, UserSearchService],
})
export class UsersModule {}
