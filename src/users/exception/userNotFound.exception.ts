import { NotFoundException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends NotFoundException {
  constructor(userId: number) {
    super(`User with id ${userId} not found`);
  }
}
