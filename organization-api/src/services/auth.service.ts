import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from 'src/dtos/loginRequestDto';
import { UsersService } from 'src/services/users.service';

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

    const user = (await this.usersService.getUserByEmail(request.email))!;

    const payload = { 
      userId: user.id,
      userRole: user.role
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
