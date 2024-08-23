import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { HealthController } from './health.controller';
import { UrlsModule } from './urls/urls.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.mongoURI,
      }),
      inject: [AppConfigService],
    }),
    UsersModule,
    AuthModule,
    UrlsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
