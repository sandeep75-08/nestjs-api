import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  validate(payload: { sub: number; email: string; roleId: number }) {
    const user = this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        role: {
          include: {
            roleModules: {
              include: {
                module: true,
              },
              omit: {
                moduleId: true,
                roleId: true,
              },
            },
          },
        },
      },
      omit: {
        password: true,
      },
    });

    return user;
  }
}
