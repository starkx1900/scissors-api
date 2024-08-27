import { InjectQueue } from '@nestjs/bull';
import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Queue } from 'bull';
import { Model, Types } from 'mongoose';
import { Analytics } from 'src/analytics/analytics.entity';
import { User } from '../users/users.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './urls.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel(Url.name) private urlModel: Model<Url>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
    @InjectQueue('analytics') private analyticsQueue: Queue,
  ) {}

  get generateRandomId(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    return randomString;
  }

  async trackAnalytics(urlId: string, ipAddress: string, userAgent: string) {
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

  async createUrl(createUrlDto: CreateUrlDto, userId: string): Promise<Url> {
    let { originalUrl, customUrl } = createUrlDto;
    const shortenedUrl = customUrl || this.generateRandomId;

    if (shortenedUrl && (await this.urlModel.findOne({ shortenedUrl }))) {
      throw new ConflictException('Url with same alias already exists');
    }

    if (
      !originalUrl.startsWith('http://') &&
      !originalUrl.startsWith('https://')
    ) {
      originalUrl = `https://${originalUrl}`;
    }

    try {
      const url = new this.urlModel({
        originalUrl,
        shortenedUrl,
        createdBy: userId,
      });

      await url.save();

      // Update the user lists of URLs
      await this.userModel.findByIdAndUpdate(userId, {
        $push: { urls: url._id },
      });

      return url;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Url with same custom alias already exists',
        );
      }
    }
  }

  async findById(id: Types.ObjectId, userId?: string): Promise<Url> {
    const url = await this.urlModel
      .findById(id)
      .populate({ path: 'analytics', model: 'Analytics' })
      .exec();
    if (!url) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found.',
      });
    }

    // If userId is provided, check if the URL belongs to the user
    console.log(
      'Creator',
      userId.toString() === (url.createdBy as any)._id.toString(),
    );
    if (userId && (url.createdBy as any)._id.toString() !== userId.toString()) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'You do not have permission to access this URL.',
      });
    }

    return url;
  }

  async findUrl(shortenedUrl: string): Promise<Url> {
    const url = await this.urlModel.findOne({ shortenedUrl }).exec();
    if (!url) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found.',
      });
    }
    return url;
  }

  async getUserUrls(userId: string): Promise<Url[]> {
    return this.urlModel.find({ createdBy: userId }).exec();
  }

  async redirectUrl(
    shortenedUrl: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<string> {
    const url = await this.findUrl(shortenedUrl);

    const analytics = await this.trackAnalytics(url.id, ipAddress, userAgent);
    await this.urlModel.findByIdAndUpdate(url._id, {
      $inc: { clicks: 1 },
      $push: { analytics: analytics._id },
    });

    return url.originalUrl;
  }

  async deleteUrl(
    id: Types.ObjectId,
    userId: string,
  ): Promise<{ message: string }> {
    const url = await this.findById(id, userId);

    if (!url) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'URL not found.',
      });
    }

    await this.urlModel.deleteOne({ _id: id }).exec();

    return { message: 'URL deleted successfully.' };
  }
}
