import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';

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
