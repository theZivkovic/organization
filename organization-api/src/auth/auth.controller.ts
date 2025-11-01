import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginRequestDto } from './dtos/loginRequestDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequestDto) {
    return this.authService.login(request);
  }

}
