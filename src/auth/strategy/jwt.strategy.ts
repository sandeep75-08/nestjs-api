import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async validate(payload: { sub: number }) {
    const user = await this.prisma.user.findUnique({
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

    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      ...user,
      modules: user.role?.roleModules.map((rm) => rm.module.name) ?? [],
    };
  }
}
