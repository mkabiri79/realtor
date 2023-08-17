import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPyload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: Array<any> = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.replaceAll('Bearer ', '');
      try {
        const payload = (await jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        )) as JWTPyload;

        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return false;
        if (roles.includes(user.user_type)) return true;
        return false;
      } catch (err) {
        return false;
      }
    }
    return true;
  }
}
