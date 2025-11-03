import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlacesRepository } from './infrastructure/repositories/placesRepository';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {
    
  }
  
  async getHello() {
   
    return {
      hello: 'Hello World!!!!',
      mongo: this.configService.get<string>('MONGO_URL'),
    }
  }
}
