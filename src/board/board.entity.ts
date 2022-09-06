import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: '20' })
  title: string;

  @Column({ type: 'varchar', length: '200' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({})
  deleteAt: Date;
}
