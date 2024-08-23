import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class HealthController {
  @ApiOperation({ summary: 'Health check' })
  @Get()
  getHello() {
    return { message: 'Welcome to scissor APi' };
  }
}
