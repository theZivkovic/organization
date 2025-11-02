import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from 'src/application/interfaces/userRepository';
import { LoginRequestDto } from 'src/dtos/loginRequestDto';;

@Injectable()
export class AuthService {

  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    private jwtService: JwtService) {
  }
  
  async login(request: LoginRequestDto) {
    if (!await this.userRepository.validateCredentials(request. email, request.password)){
      throw new UnauthorizedException();
    }

    const user = (await this.userRepository.getByEmail(request.email))!;

    const payload = { 
      userId: user.id,
      userRole: user.role
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
