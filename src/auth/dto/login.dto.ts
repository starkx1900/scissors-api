import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: "The user's email" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "The user's password" })
  @IsString()
  @MinLength(6)
  password: string;
}
