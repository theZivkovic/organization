import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService, private placeRepository: PlaceRepository) {
    
  }
  
  async getHello() {
    const place = await this.placeRepository.getByName('Novi Beograd');

    return {
      hello: 'Hello World!!!!',
      mongo: this.configService.get<string>('MONGO_URL'),
      placeDescendants: place ? await this.placeRepository.getAllDescendants(place) : [],
      place: place
    }
  }
}
