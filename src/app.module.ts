import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';

const cookieSession = require('cookie-session');
const ormConfig = require('../ormconfig.js');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot(ormConfig)
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: 'sqlite',
    //     database: config.get<string>('DB_NAME'),
    //     entities: [User, Report],
    //     synchronize: true
    //   })
    // })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true })
    }
  ]
})
export class AppModule {
  constructor(private readonly config: ConfigService) {
  }

  public configure(consumer: MiddlewareConsumer): void {
    const keys = [this.config.get<string>('COOKIE_KEY')];
    consumer.apply(cookieSession({ keys })).forRoutes('*');
  }
}