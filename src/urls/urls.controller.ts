import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
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

  @Get(':shortenedUrl')
  async redirectToOriginal(
    @Param('shortenedUrl') shortenedUrl: string,
    @Request() req,
    @Res() res: Response,
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

    return res.redirect(url);
  }
}
