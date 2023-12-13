import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

//cargo los datos que deseo agregar a la base de datos con el endpoint post  que esta en mi product.controller
export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'wowen', 'kid', 'unisex'])
  gender: string;
}
