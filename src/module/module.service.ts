/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { CreateModuleDTO, GetAllModulesDTO, UpdateModuleDTO } from './dto';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async getAllModules(reqBody: GetAllModulesDTO) {
    try {
      if (reqBody.page < 1 || reqBody.limit < 1)
        throw new Error('Invalid pagination parameters!');

      const modules = await this.prisma.module.findMany({
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
        include: {
          roleModules: {
            include: {
              role: true,
            },
          },
        },
      });

      return {
        status: true,
        message: 'Modules fetched successfully',
        data: modules,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async findModule(id: number) {
    try {
      const module = await this.prisma.module.findUnique({
        where: { id },
        include: {
          roleModules: { include: { role: true } },
        },
      });

      if (!module) throw new BadRequestException('Module does not exists!');
      return {
        status: true,
        message: 'Module fetched successfully',
        data: module,
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async createModule(reqBody: CreateModuleDTO) {
    try {
      const module = await this.prisma.module.create({
        data: {
          name: reqBody.name,
          roleModules: reqBody.roleIds
            ? {
                create: reqBody.roleIds.map((roleId) => ({
                  roleId,
                })),
              }
            : undefined,
        },
        include: {
          roleModules: { include: { role: true } },
        },
      });

      return {
        status: true,
        message: 'Module created successfully',
        data: module,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ForbiddenException(
            'Assigned role(s) does not exists, Please create some.',
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

  async updateModule(id: number, reqBody: UpdateModuleDTO) {
    try {
      const updatedModule = await this.prisma.module.update({
        where: { id },
        data: {
          name: reqBody.name,
          roleModules: reqBody.roleIds
            ? {
                deleteMany: {},
                create: reqBody.roleIds.map((roleId) => ({
                  roleId,
                })),
              }
            : undefined,
        },
        include: {
          roleModules: { include: { role: true } },
        },
      });

      return {
        status: true,
        message: 'Module updated successfully',
        data: updatedModule,
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

  async deleteModule(id: number) {
    try {
      await this.prisma.module.delete({
        where: { id },
      });

      return {
        status: true,
        message: 'Module deleted successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException('Module does not exists!');
        }
      }
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
