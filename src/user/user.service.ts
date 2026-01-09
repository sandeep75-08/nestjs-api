/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { AddUserDTO, GetAllUsersDTO, UpdateUserDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(reqBody: GetAllUsersDTO) {
    try {
      if (reqBody.page < 1 || reqBody.limit < 1)
        throw new Error('Invalid pagination parameters!');
      const users = await this.prisma.user.findMany({
        where: reqBody.search
          ? {
              fullName: {
                startsWith: reqBody.search,
                mode: 'insensitive',
              },
            }
          : {},
        skip: (reqBody.page - 1) * reqBody.limit,
        take: reqBody.limit,
        orderBy: { fullName: 'asc' },
        omit: {
          password: true,
        },
      });

      return {
        status: true,
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message,
        data: null,
      };
    }
  }

  async addUser(reqBody: AddUserDTO) {
    try {
      if (reqBody.roleId) {
        const roleExists = await this.prisma.role.findUnique({
          where: { id: reqBody.roleId },
          select: { id: true },
        });

        if (!roleExists) {
          throw new ForbiddenException('Role does not exists!');
        }
      }

      const hashedPassword = await hash(reqBody.password);

      const user = await this.prisma.user.create({
        data: {
          email: reqBody.email,
          fullName: reqBody.fullName,
          password: hashedPassword,
          roleId: reqBody.roleId,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
        },
      });

      return { status: true, message: 'Signed up successfully', reqBody: user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email is already in use');
        }
      }
      throw error;
    }
  }

  async updateUser(reqBody: UpdateUserDTO) {
    try {
      if (reqBody.roleId) {
        const roleExists = await this.prisma.role.findUnique({
          where: { id: reqBody.roleId },
          select: { id: true },
        });

        if (!roleExists) {
          throw new ForbiddenException('Role does not exists!');
        }
      }

      const user = await this.prisma.user.update({
        where: { id: reqBody.id },
        data: {
          fullName: reqBody.fullName,
        },
        omit: {
          password: true,
        },
      });

      return {
        status: true,
        message: 'User updated successfully',
        reqBody: user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email is already in use');
        }
      }
      throw error;
    }
  }
}
