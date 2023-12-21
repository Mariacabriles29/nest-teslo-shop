import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty()
  //se declaran las variables con las propiedades de typeorm
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //se usa column para definir las columnas
  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  title: string;
  @ApiProperty()
  @Column('float', {
    default: 0,
  })
  price: number;
  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  slug: string;
  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty()
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  //tags
  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  //relacion uno a mucho un producto puede tener muchas images
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  //se usa el BeforeInsert para que antes de insertarlo revise el slug sino existe lo replace por lo que tiene el titulo
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("' ", '');
  }
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
