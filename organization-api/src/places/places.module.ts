import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { ConfigModule } from '@nestjs/config';
import { PlacesService } from './places.service';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from 'src/infrastructure/models/placeModel';
import { UserPlaceRepository } from 'src/infrastructure/repositories/userPlaceRepository';
import { UserPlace, UserPlaceSchema } from 'src/infrastructure/models/userPlaceModel';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { User, UserSchema } from 'src/infrastructure/models/userModel';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: UserPlace.name, schema: UserPlaceSchema},
      { name: User.name, schema: UserSchema}
    ]),
    ConfigModule.forRoot()
  ],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceRepository, UserPlaceRepository, UserRepository]
})
export class PlacesModule {}
