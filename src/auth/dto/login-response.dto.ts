import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty({ example: '66c64895e0b5257907ba5712' })
  _id: string;

  @ApiProperty({ example: 'Givens' })
  name: string;

  @ApiProperty({ example: 'givens@altschool.com' })
  email: string;

  @ApiProperty({
    example: [],
    description: 'Array of URLs associated with the user',
  })
  urls: string[];
}

export class LoginResponseDto {
  @ApiProperty({ example: 'User login successful' })
  message: string;

  @ApiProperty({
    type: UserDto,
    example: {
      token: 'eyJhbGci...',
      user: {
        _id: '66c64895e0b5257900ba5712',
        name: 'Givens',
        email: 'testuser@altschool.com',
        urls: [],
      },
    },
  })
  data: {
    token: string;
    user: UserDto;
  };
}
