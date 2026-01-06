import { Injectable } from '@nestjs/common';
import { getAllRolesDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getAllRoles(reqBody: getAllRolesDTO) {
    try {
      if (reqBody.page < 1 || reqBody.limit < 1)
        throw new Error('Invalid pagination parameters!');
      const roles = await this.prisma.role.findMany({
        where: reqBody.search
          ? {
              name: {
                startsWith: reqBody.search,
                mode: 'insensitive',
              },
            }
          : {},
        skip: (reqBody.page - 1) * reqBody.limit,
        take: reqBody.limit,
        orderBy: { name: 'asc' },
      });

      return {
        status: true,
        message: 'Roles fetched successfully',
        data: roles,
      };
    } catch (error: any) {
      return {
        status: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: error.message,
        data: null,
      };
    }
  }
}
