import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceRepository } from './db/repository/placeRepository';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService, private placeRepository: PlaceRepository) {
    
  }
  
  async getHello() {
    const place = await this.placeRepository.findByName('Vracar');

    return {
      hello: 'Hello World!!!!',
      mongo: this.configService.get<string>('MONGO_URL'),
      placeDescendants: place ? await this.placeRepository.findAllDescendants(place) : []
    }
  }
}
