import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './db/repository/placeRepository';
import { PlaceSchema, Place } from './db/schemas/placeSchema';

@Module({
  imports: [
      MongooseModule.forRoot(process.env.MONGO_URL as string),
      MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema}]),
      ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, PlaceRepository],
})

export class AppModule {}