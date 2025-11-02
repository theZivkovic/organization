import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Association, AssociationSchema } from 'src/infrastructure/models/associationModel';
import { AssociationRepository } from 'src/infrastructure/repositories/associationRepository';
import { AssociationsController } from './associations.controller';
import { ConfigModule } from '@nestjs/config';
import { PlacesService } from 'src/places/places.service';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { Place, PlaceSchema } from 'src/infrastructure/models/placeModel';
import { RegistrationTokenService } from 'src/registration-token/registration-token.service';
import { RegistrationTokenRepository } from 'src/infrastructure/repositories/registrationCodeRepository';
import { User, UserSchema } from 'src/infrastructure/models/userModel';
import { RegistrationToken, RegistrationTokenSchema } from 'src/infrastructure/models/registrationTokenModel';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Association.name, schema: AssociationSchema},
      { name: Place.name, schema: PlaceSchema},
      { name: User.name, schema: UserSchema},
      { name: RegistrationToken.name, schema: RegistrationTokenSchema}
    ]),
    ConfigModule.forRoot()
  ],
  controllers: [AssociationsController],
  providers: [
    AssociationsService, AssociationRepository, 
    PlacesService, PlaceRepository, 
    UsersService, UserRepository, 
    RegistrationTokenService, RegistrationTokenRepository]
})
export class AssociationsModule {}
