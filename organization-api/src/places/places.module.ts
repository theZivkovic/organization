import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { ConfigModule } from '@nestjs/config';
import { PlacesService } from './places.service';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from 'src/infrastructure/models/placeModel';
import { AssociationRepository } from 'src/infrastructure/repositories/associationRepository';
import { Association, AssociationSchema } from 'src/infrastructure/models/associationModel';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { User, UserSchema } from 'src/infrastructure/models/userModel';
import { AssociationsController } from './associationsController';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Association.name, schema: AssociationSchema},
      { name: User.name, schema: UserSchema}
    ]),
    ConfigModule.forRoot()
  ],
  controllers: [PlacesController, AssociationsController],
  providers: [PlacesService, PlaceRepository, AssociationRepository, UserRepository]
})
export class PlacesModule {}
