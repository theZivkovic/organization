import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';

@Injectable()
export class AuthService {

  constructor(private configService: ConfigService, private userRepository: UserRepository) {
    
  }
  
  async login(email: string, password: string) {
    return {
      valid: await this.userRepository.validate(email, password)
    };
  }
}
