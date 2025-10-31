import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { ConfigModule } from '@nestjs/config';
import { PlacesService } from './places.service';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from 'src/infrastructure/models/placeModel';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
    ConfigModule.forRoot()
  ],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceRepository]
})
export class PlacesModule {}
