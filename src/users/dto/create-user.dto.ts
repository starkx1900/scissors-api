import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: "The user's name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "The user's email address" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "The user's password" })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
