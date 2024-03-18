import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChannelsModule } from './channels/channels.module';
import { DatabaseModule } from './database.module';
import { MessagesModule } from './messages/messages.module';
import { ParticipantsModule } from './participants/participants.module';
import { ServersModule } from './servers/servers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthenticationModule,
    UsersModule,
    ParticipantsModule,
    MessagesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),

        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    ServersModule,
    ChannelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
