import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { AnalyticsSchema } from './analytics.entity';
import { AnalyticsProcessor } from './analytics.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Analytics', schema: AnalyticsSchema }]),
    BullModule.registerQueueAsync({
      name: 'analytics',
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => {
        return {
          redis: {
            host: configService.redisHost,
            port: configService.redisPort,
          },
        };
      },
      inject: [AppConfigService],
    }),
  ],
  providers: [AnalyticsProcessor],
})
export class AnalyticsModule {}
