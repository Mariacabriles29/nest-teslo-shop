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
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

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
  //agregando lo datos para la paginacion
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.productRepository.find({
      take: limit,
      skip: offset,

      //TODO Relaciones
    });
  }
  // para buscar por slug o id
  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        //uso LOWER para convertir la cedena minuscula y a su vez la consulta se vuelve sensible a mayus y minusculas es decir puedo buscar por las dos e igual sigue
        //funcionano
        .where('LOWER(title) = LOWER(:title) OR LOWER(slug) = LOWER(:slug)', {
          title: term,
          slug: term,
          //Uso getOne() para indicar que solo me interesa alguno de los dos
        })
        .getOne();
    }

    //esto es parecido a hacer un select `select *from Products where slug='XX' or title='xxx'`

    if (!product)
      throw new NotFoundException(`Product with id ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
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
