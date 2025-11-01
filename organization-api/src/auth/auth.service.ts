import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginRequestDto } from './dtos/loginRequestDto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService) {
    
  }
  
  async login(request: LoginRequestDto) {
    if (!await this.usersService.validate(request. email, request.password)){
      throw new UnauthorizedException();
    }

    const user = (await this.usersService.getByEmail(request.email))!;

    const payload = { 
      userId: user.id,
      userRole: user.role
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
