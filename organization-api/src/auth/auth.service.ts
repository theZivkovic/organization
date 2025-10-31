import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService) {
    
  }
  
  async login(email: string, password: string) {
    
    if (!await this.usersService.validate(email, password)){
      throw new UnauthorizedException();
    }

    const user = (await this.usersService.getByEmail(email))!;

    const payload = { sub: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }
}
