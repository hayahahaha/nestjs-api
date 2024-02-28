import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerr.dto';
import bcrypt from 'bcrypt';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerData: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerData.password, 10);

      const createdUser = await this.usersService.create({
        ...registerData,
        password: hashedPassword,
      });

      createdUser.password = undefined;

      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Some thing wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      this.verifyPassword(password, user.password);

      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
