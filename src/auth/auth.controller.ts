import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginUserDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Registers a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.authService.register(dto);
    return {
      message: 'User registered successfully',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Logs in a user' })
  @ApiResponse({
    status: 200,
    description: 'User login successful',
    type: LoginResponseDto,
  })
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginUserDto) {
    const result = await this.authService.login(dto);
    return {
      message: 'User login successful',
      data: result,
    };
  }
}
