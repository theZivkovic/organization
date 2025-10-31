import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';

@Injectable()
export class UserService {

  constructor(private configService: ConfigService, private userRepository: UserRepository) {
    
  }
  
  async login() {
    
    return {
      user: await this.userRepository.findByEmail('dejan.zivkovic90@gmail.com')
    }
  }
}
