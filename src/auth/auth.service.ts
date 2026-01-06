import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDTO, SignUpDTO } from './dto';
import { hash, verify } from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(reqBody: SignUpDTO) {
    try {
      const hashedPassword = await hash(reqBody.password);

      const user = await this.prisma.user.create({
        data: {
          email: reqBody.email,
          fullName: reqBody.fullName,
          password: hashedPassword,
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

  async signin(reqBody: SignInDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: reqBody.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials are not correct');

    const isPasswordCorrect = await verify(user.password, reqBody.password);

    if (!isPasswordCorrect)
      throw new ForbiddenException('Credentials are not correct');

    return {
      status: true,
      message: 'Signed in successfully',
      data: await this.signToken(user.id, user.email),
    };
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
