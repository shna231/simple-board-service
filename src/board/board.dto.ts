import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BoardCreateDTO {
  @ApiProperty({
    description: '게시글 비밀번호',
    required: true,
    default: 'abcde1',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: '게시글 제목',
    required: true,
    default: 'title1',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    required: true,
    default: 'come contents',
  })
  @IsNotEmpty()
  @IsString()
  contenxt: string;
}
