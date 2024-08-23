import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get mongoURI(): string {
    return this.configService.get<string>('MONGODB_URI');
  }

  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  get redisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  get redisUsername(): string {
    return this.configService.get<string>('REDIS_USERNAME');
  }

  get redisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }
}
