import { Controller, Post, Body } from '@nestjs/common';
import type { LoginRequestDto } from 'src/presentation/dtos/loginRequestDto';
import { AuthService } from 'src/presentation/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequestDto) {
    return this.authService.login(request);
  }
}
