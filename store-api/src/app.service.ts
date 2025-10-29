import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeRepository } from './db/repository/nodeRepository';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService, private nodeRepository: NodeRepository) {
    
  }
  
  async getHello() {
    return {
      hello: 'Hello World!!!!',
      mongo: this.configService.get<string>('MONGO_URL'),
      nodes: await this.nodeRepository.findByName('Srbija')
    }
  }
}
