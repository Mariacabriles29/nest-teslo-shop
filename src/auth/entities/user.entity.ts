import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  email: string;
  @Column('text', {
    select: false,
  })
  password: string;
  @Column('text')
  fullName: string;
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['User'],
  })
  roles: string[];

  @BeforeInsert()
  checkFiledsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFiledsBeforeUpdate() {
    this.checkFiledsBeforeInsert();
  }
}
