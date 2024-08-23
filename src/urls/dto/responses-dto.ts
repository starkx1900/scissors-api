import { ApiProperty } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty({ description: 'The original URL' })
  originalUrl: string;

  @ApiProperty({ description: 'The shorten URL' })
  shortenedUrl: string;

  @ApiProperty({ description: 'The custom URL/alias for the shorten URL' })
  customUrl: string;

  @ApiProperty({ description: 'The number of clicks on the shorten URL' })
  clicks: number;

  @ApiProperty({ description: 'The date the shorten URL was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The user who created the shorten URL' })
  createdBy: string;

  constructor(partial: Partial<UrlResponseDto>) {
    Object.assign(this, partial);
  }
}
