import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({ description: 'The original URL' })
  @IsUrl()
  @IsNotEmpty()
  originalUrl: string;

  @ApiPropertyOptional({ description: 'Custom URL/alias for the shorten URL' })
  @IsOptional()
  @IsString()
  customUrl?: string;
}
