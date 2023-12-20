import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { fork } from 'child_process';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
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

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new BadRequestException('User not found');
    console.log({ userRoles: user.roles });
    //realizo un forof para verificar los roles
    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles}]`,
    );
  }
}
