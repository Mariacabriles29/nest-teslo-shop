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
import { JwTPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    //se realiza la inyeccion del repositorio para poder usar la entidad User
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
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
      return { ...user, token: this.getJwtToken({ id: user.id }) };
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
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');
    //comparo  si existe un usuario
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    //TODO: Retornar el JWT acceso
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }
  private getJwtToken(payload: JwTPayload) {
    //para generar el token y firmarlo

    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
