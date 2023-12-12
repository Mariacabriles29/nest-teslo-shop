import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  //se declaran las variables con las propiedades de typeorm
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //se usa el deoorador column para definir las columnas
  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('numeric', {
    default: 0,
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  //tags
  //images
}
