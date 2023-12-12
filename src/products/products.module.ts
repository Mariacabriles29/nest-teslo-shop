import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  //para poder usar la entidad de los products debo importarla aqui
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
