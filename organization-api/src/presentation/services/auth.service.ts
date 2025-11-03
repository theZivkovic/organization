import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCases } from 'src/application/useCases/auth';
import { LoginRequestDto } from 'src/dtos/loginRequestDto';;

@Injectable()
export class AuthService {

  constructor(
    private authCases: AuthCases,
    private jwtService: JwtService) {
  }
  
  async login(request: LoginRequestDto) {
     const user = await this.authCases.getUserByCredentials(request.email, request.password);

    const payload = { 
      userId: user.id,
      userRole: user.role
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
