import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardCreateDTO, BoardDeleteDTO } from './board.dto';
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

      const regx = /^(?=.*[a-zA-Z])(?=.*\d{1,14}).{6,14}$/;
      if (!regx.test(password)) {
        throw new BadRequestException(
          Object.assign({
            statusCode: 400,
            message: '비밀번호에는 최소 1자 이상의 숫자가 포함되어야 합니다.',
          }),
        );
      }

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
        select: { title: true, content: true, createdAt: true },
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

  async delete(input: BoardDeleteDTO) {
    try {
      const page = await this.boardrepository.findOneBy({ id: input.id });

      if (!page) {
        throw new NotFoundException(
          Object.assign({
            statsCode: 404,
            message: '삭제하고자 하는 게시글이 이미 존재하지 않습니다.',
          }),
        );
      } else if (!(await bcrypt.compare(input.password, page.password))) {
        throw new ForbiddenException(
          Object.assign({
            statusCode: 403,
            message: '게시글의 비밀번호와 일치하지 않습니다.',
          }),
        );
      } else {
        await this.boardrepository.softDelete(input.id);

        return Object.assign({
          statuscode: 200,
          message: '게시글을 삭제하였습니다.',
        });
      }
    } catch (NotFoundException) {
      throw NotFoundException;
    }
  }
}
