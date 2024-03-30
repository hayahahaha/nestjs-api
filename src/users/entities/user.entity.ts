import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Address } from './address.entity';
import { PublicFile } from '../../files/publicFile.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: Address;


  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true
  })
  public avatar?: PublicFile


  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;
}
