import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDTO } from './dto';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // async signup(reqBody: SignUpDTO) {
  //   try {
  //     if (reqBody.roleId) {
  //       const roleExists = await this.prisma.role.findUnique({
  //         where: { id: reqBody.roleId },
  //         select: { id: true },
  //       });

  //       if (!roleExists) {
  //         throw new ForbiddenException('Role does not exists!');
  //       }
  //     }

  //     const hashedPassword = await hash(reqBody.password);

  //     const user = await this.prisma.user.create({
  //       data: {
  //         email: reqBody.email,
  //         fullName: reqBody.fullName,
  //         password: hashedPassword,
  //         roleId: reqBody.roleId,
  //       },
  //       select: {
  //         id: true,
  //         email: true,
  //         fullName: true,
  //         createdAt: true,
  //       },
  //     });

  //     return { status: true, message: 'Signed up successfully', reqBody: user };
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       if (error.code === 'P2002') {
  //         throw new ForbiddenException('Email is already in use');
  //       }
  //     }
  //     throw error;
  //   }
  // }

  async signin(reqBody: SignInDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: reqBody.email,
      },
      include: {
        role: true,
      },
    });

    if (!user) throw new ForbiddenException('Credentials are not correct');

    const isPasswordCorrect = await verify(user.password, reqBody.password);

    if (!isPasswordCorrect)
      throw new ForbiddenException('Credentials are not correct');

    return {
      status: true,
      message: 'Signed in successfully',
      data: {
        token: await this.signToken(user.id, user.email, user.roleId),
        user: {
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
    };
  }

  signToken(
    userId: number,
    email: string,
    roleId: number | null,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      roleId,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
