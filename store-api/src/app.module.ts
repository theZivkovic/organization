import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NodeRepository } from './db/repository/nodeRepository';
import { NodeSchema, Node } from './db/schemas/nodeSchema';
import { TreeNodeType } from './db/tree';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://admin:password@mongodb:27017/stores?authSource=admin'),
      MongooseModule.forFeature([{ name: Node.name, schema: NodeSchema}]),
      ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, NodeRepository],
})
export class AppModule implements OnApplicationBootstrap{
  constructor(private readonly nodeRepository: NodeRepository) {}

      async onApplicationBootstrap() {
        console.log('Seeding initial data...');
        const nodeCount = await this.nodeRepository.countNodes();
        if (nodeCount === 0) {
          await this.nodeRepository.insert({
            name: 'Srbija',
            type: TreeNodeType.OFFICE,
            left: 1,
            right: 11
          }); // A method in your UserService to seed users
        }
      }
}
