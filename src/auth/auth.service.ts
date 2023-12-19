import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    //se realiza la inyeccion del repositorio para poder usar la entidad User
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  //creando un usuario
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        //encriptacion del password
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      ///para que no me muestre la contraseña
      delete user.password;
      return user;
      //Todo  retornar el JWT de acceso
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  //login
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');
    //comparo  si existe un usuario
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    return user;

    //TODO: Retornar el JWT
  }
  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
