import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //para poder usar la entidad de los products debo importarla aqui
  imports: [TypeOrmModule.forFeature([Product, ProductImage])],
})
export class ProductsModule {}
