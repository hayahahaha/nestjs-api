import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './participants/rooms/rooms.module';
import { RoomsModule } from './rooms/rooms.module';
import { ParticipantsModule } from './participants/participants.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [UsersModule, RoomsModule, ParticipantsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
