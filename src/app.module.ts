import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ParticipantsModule } from './participants/participants.module';
import { MessagesModule } from './messages/messages.module';
import { DatabaseModule } from './database.module';
import * as Joi from '@hapi/joi';
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [
    UsersModule, 
    RoomsModule, 
    ParticipantsModule, 
    MessagesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      })
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
