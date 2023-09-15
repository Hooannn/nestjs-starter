import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Knex as KnexModule } from './database';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from '@nestjs-modules/mailer';
import config from './configs';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    KnexModule,
    NotificationsModule,
    LoggerModule.forRoot(),
    AuthModule,
    JwtModule.register({
      global: false,
      secret: config.JWT_AUTH_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    RedisModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: config.GMAIL_USER,
          pass: config.GMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '<noreply@moneymaster.com>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
