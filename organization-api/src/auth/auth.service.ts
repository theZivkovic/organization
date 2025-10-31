import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(private configService: ConfigService, private usersService: UsersService) {
    
  }
  
  async login(email: string, password: string) {
    return {
      valid: await this.usersService.validate(email, password)
    };
  }
}
