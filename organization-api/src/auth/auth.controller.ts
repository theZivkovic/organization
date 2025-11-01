import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginRequestDto } from './dtos/loginRequestDto';
import type { RegisterRequestDto } from '../users/dtos/registerRequestDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequestDto) {
    return this.authService.login(request);
  }

  @Post('register')
  async register(@Body() request: RegisterRequestDto) {
    return this.authService.register(request);
  }

}
