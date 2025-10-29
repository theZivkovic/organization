import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { NodeRepository } from './db/repository/nodeRepository';
import { NodeSchema, Node } from './db/schemas/nodeSchema';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://admin:password@mongodb:27017/stores?authSource=admin'),
      MongooseModule.forFeature([{ name: Node.name, schema: NodeSchema}]),
      ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, NodeRepository],
})
export class AppModule {}
