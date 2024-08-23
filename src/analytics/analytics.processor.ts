import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { Analytics } from './analytics.entity';

@Processor('analytics')
export class AnalyticsProcessor {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
  ) {}

  @Process('track')
  async handleUrlAnalytics(job: Job<any>) {
    const { urlId, ipAddress, userAgent } = job.data;

    const geoResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`);

    const { city, region, country_name } = geoResponse.data;
    const location = `${city}, ${region}, ${country_name}`;
    const analytics = new this.analyticsModel({
      urlId,
      ipAddress,
      userAgent,
      location,
    });

    return analytics.save();
  }
}
