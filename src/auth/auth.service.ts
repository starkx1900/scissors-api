import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { token, user };
  }

  async register(user: any) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.usersService.create({
      ...user,
      password: hashedPassword,
    });
  }
}
