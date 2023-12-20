import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
//este guard se va encargar de ver el usuario y revisar si tiene sus roles
@Injectable()
export class UserRoleGuard implements CanActivate {
  //para obtener la metadata
  constructor(private readonly reflector: Reflector) {}

  //para que un guard sea valido tiene que implementar el metodo de canActive
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );

    console.log({ validRoles });

    return true;
  }
}
