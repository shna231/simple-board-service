import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardCreateDTO } from './board.dto';
import { Board } from './board.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardrepository: Repository<Board>,
  ) {}

  async create(input: BoardCreateDTO) {
    try {
      const { title, content, password } = input;
      const salt = await bcrypt.genSalt();
      const hashed_password = await bcrypt.hash(password, salt);

      await this.boardrepository.save({
        title: title,
        content: content,
        password: hashed_password,
      });

      return Object.assign({
        statusCode: 201,
        message: '게시글이 등록되었습니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
