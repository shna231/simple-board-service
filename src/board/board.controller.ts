import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoardCreateDTO } from './board.dto';
import { BoardService } from './board.service';

@ApiTags('게시글')
@Controller('api/board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: '게시글 생성 API',
    description: '제목, 내용, 비밀번호를 입력하고 게시글을 작성합니다.',
  })
  async create(@Body() generalInputDto: BoardCreateDTO) {
    return await this.boardService.create(generalInputDto);
  }

  @Get(':offset')
  @ApiOperation({
    summary: '게시글 조회 API',
    description: 'offset 값을 기준으로 게시글을 최신 순 20개씩 조회합니다.',
  })
  async getPart(@Param('offset') offset: number) {
    return await this.boardService.getPart(offset);
  }
}
