import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getPart(offset: number) {
    try {
      const limit = 20;
      const pages = await this.boardrepository.find({
        select: { title: true, content: true },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });

      if (pages.length == 0) {
        throw new NotFoundException(
          Object.assign({
            statusCode: 404,
            message: '게시글이 존재하지 않습니다.',
          }),
        );
      }

      return Object.assign({
        data: pages,
        statusCode: 200,
        message: '게시글을 불러옵니다.',
      });
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
