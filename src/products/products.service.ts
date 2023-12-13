import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  //a este loger se le puede mandar un contexto de tipo string y se usa para manejo de errores especificos
  private readonly logger = new Logger('ProductsService');

  //inyectando un patron repositorio en le entidad Product para insertar datos
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      //crea el registro
      const product = this.productRepository.create(createProductDto);
      //guardar el registro en la base de datos
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //para comenzar a hacer el get poder ver todos los datos insertados en la base de datos
  //Todo falta paginar
  findAll() {
    return this.productRepository.find({});
  }
  //para buscar por id
  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }
  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }
  //se crea este metodo para manejar los errores
  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
