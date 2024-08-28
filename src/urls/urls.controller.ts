import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUrlDto } from './dto/create-url.dto';
import { UrlResponseDto } from './dto/responses-dto';
import { Url } from './urls.entity';
import { UrlsService } from './urls.service';

@ApiTags('URLs')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieves all shortened urls for the current logged in user',
  })
  @ApiResponse({
    status: 200,
    description: 'URLs retrieval successful',
    type: UrlResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllUrls(@Request() req): Promise<{ message: string; data: Url[] }> {
    const urls = await this.urlsService.getUserUrls(req.user._id);
    return {
      message: 'URLs retrieval successful',
      data: urls,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Shortens a new url' })
  @ApiResponse({
    status: 201,
    description: 'Shortened URL created successfully',
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid URL or request data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Request() req,
  ): Promise<{ message: string; data: Url }> {
    const url = await this.urlsService.createUrl(createUrlDto, req.user._id);
    return {
      message: 'Shortened URL created successfully',
      data: url,
    };
  }

  @ApiOperation({
    summary: 'Redirect to the original URL based on the shortened URL',
  })
  @ApiParam({
    name: 'shortenedUrl',
    description: 'The shortened URL to be redirected',
  })
  @ApiResponse({ status: 302, description: 'Redirect to the original URL' })
  @ApiResponse({ status: 404, description: 'Shortened URL not found' })
  @SkipThrottle()
  @Get('/redirect/:shortenedUrl')
  async redirectToOriginal(
    @Param('shortenedUrl') shortenedUrl: string,
    @Request() req,
  ) {
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const url = await this.urlsService.redirectUrl(
      shortenedUrl,
      ipAddress,
      userAgent,
    );

    return { originalUrl: url };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Retrieves the shortened url details for the current logged in user',
  })
  @ApiResponse({
    status: 200,
    description: 'URL retrieval successful',
    type: UrlResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('/:urlId')
  async getUrl(
    @Request() req,
    @Param('urlId') urlId: Types.ObjectId,
  ): Promise<{ message: string; data: Url }> {
    if (!Types.ObjectId.isValid(urlId)) {
      throw new BadRequestException(`${urlId} is not a valid ObjectId`);
    }
    const url = await this.urlsService.findById(urlId, req.user._id);
    return {
      message: 'URL retrieval successful',
      data: url,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully.' })
  @ApiResponse({ status: 404, description: 'URL not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':id')
  @HttpCode(200)
  async deleteUrl(
    @Param('urlId') urlId: Types.ObjectId,
    @Request() req,
  ): Promise<{ message: string }> {
    return this.urlsService.deleteUrl(urlId, req.user._id);
  }
}
