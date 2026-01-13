/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSION_KEY } from '../decorator';
import { PermissionAction } from 'types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<{
      module: string;
      action: string;
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!permission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const roleModule = await this.prisma.roleModule.findFirst({
      where: {
        roleId: user.roleId,
        module: {
          name: {
            equals: permission.module,
            mode: 'insensitive',
          },
        },
      },
      include: { module: true },
    });

    if (!roleModule) {
      throw new ForbiddenException('Access denied');
    }

    const permissionMap: Record<PermissionAction, boolean> = {
      read: roleModule.canRead,
      write: roleModule.canWrite,
      update: roleModule.canUpdate,
      delete: roleModule.canDelete,
    };

    const allowed = permissionMap[permission.action];

    if (!allowed) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
