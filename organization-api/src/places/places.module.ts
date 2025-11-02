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
import { UsersService } from 'src/users/users.service';
import { AssociationsService } from 'src/associations/associations.service';
import { RegistrationTokenService } from 'src/registration-token/registration-token.service';
import { RegistrationTokenRepository } from 'src/infrastructure/repositories/registrationCodeRepository';
import { RegistrationToken, RegistrationTokenSchema } from 'src/infrastructure/models/registrationTokenModel';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Association.name, schema: AssociationSchema},
      { name: User.name, schema: UserSchema},
      { name: RegistrationToken.name, schema: RegistrationTokenSchema }
    ]),
    ConfigModule.forRoot()
  ],
  controllers: [PlacesController],
  providers: [
      PlacesService, PlaceRepository, 
      AssociationsService, AssociationRepository,
      UsersService, UserRepository,
      RegistrationTokenService, RegistrationTokenRepository
    ]
})
export class PlacesModule {}
