import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, ConfigService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
