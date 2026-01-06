import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignUpDTO) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: SignInDTO) {
    return this.authService.signin(body);
  }
}
