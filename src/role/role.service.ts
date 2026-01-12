/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRoleDTO, GetAllRolesDTO, UpdateRoleDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getAllRoles(reqBody: GetAllRolesDTO) {
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
        orderBy: { name: 'desc' },
        include: {
          roleModules: {
            include: {
              module: true,
            },
            omit: {
              roleId: true,
              moduleId: true,
            },
          },
        },
      });

      return {
        status: true,
        message: 'Roles fetched successfully',
        data: roles,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async findRole(id: number) {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
        include: {
          roleModules: {
            include: { module: true },
            omit: {
              moduleId: true,
              roleId: true,
            },
          },
        },
      });

      if (!role) throw new Error('Role does not exists!');
      return {
        status: true,
        message: 'Role fetched successfully',
        data: role,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async createRole(reqBody: CreateRoleDTO) {
    try {
      const role = await this.prisma.role.create({
        data: {
          name: reqBody.name,
          roleModules: reqBody.moduleIds
            ? {
                create: reqBody.moduleIds.map((moduleId) => ({
                  moduleId,
                })),
              }
            : undefined,
        },
        include: {
          roleModules: { include: { module: true } },
        },
      });

      return {
        status: true,
        message: 'Role created successfully',
        data: role,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ForbiddenException(
            'Assigned module(s) does not exists, Please create some.',
          );
        }
      }
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async updateRole(id: number, reqBody: UpdateRoleDTO) {
    try {
      const updatedRole = await this.prisma.role.update({
        where: { id },
        data: {
          name: reqBody.name,
          roleModules: reqBody.moduleIds
            ? {
                deleteMany: {},
                create: reqBody.moduleIds.map((moduleId) => ({
                  moduleId,
                })),
              }
            : undefined,
        },
        include: {
          roleModules: {
            include: { module: true },
            omit: { roleId: true, moduleId: true },
          },
        },
      });

      return {
        status: true,
        message: 'Role updated successfully',
        data: updatedRole,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ForbiddenException(
            'Assigned module(s) does not exists, Please create some.',
          );
        }
      }
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async deleteRole(id: number) {
    try {
      await this.prisma.role.delete({
        where: { id },
      });

      return {
        status: true,
        message: 'Role deleted successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Role does not exists!');
        }
      }
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
