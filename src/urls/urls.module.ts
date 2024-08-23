import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsSchema } from 'src/analytics/analytics.entity';
import { AnalyticsProcessor } from 'src/analytics/analytics.processor';
import { UserSchema } from '../users/users.entity';
import { UrlsController } from './urls.controller';
import { UrlSchema } from './urls.entity';
import { UrlsService } from './urls.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Analytics', schema: AnalyticsSchema }]),
    BullModule.registerQueue({
      name: 'analytics',
    }),
  ],
  providers: [AnalyticsProcessor, UrlsService],
  controllers: [UrlsController],
})
export class UrlsModule {}
