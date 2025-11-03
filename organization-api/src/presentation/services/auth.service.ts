import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUseCases } from 'src/application/useCases/auth.usecases';
import { LoginRequestDto } from 'src/presentation/dtos/loginRequestDto';;

@Injectable()
export class AuthService {

  constructor(
    private authUseCases: AuthUseCases,
    private jwtService: JwtService) {
  }
  
  async login(request: LoginRequestDto) {
     const user = await this.authUseCases.getUserByCredentials(request.email, request.password);

    const payload = { 
      userId: user.id,
      userRole: user.role
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
