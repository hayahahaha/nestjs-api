import {
  Controller,
  Get,
  Post,
  Body, Patch,
  UploadedFile,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { FindOneParams } from '../utils/findOneParams';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import RequestWithUser from '../authentication/requestWithUser.interface'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    if (Number(id)) return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File) {
    return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname)
  }
}
