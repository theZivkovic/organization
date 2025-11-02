import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';
// import { PlaceSchema, Place } from './infrastructure/models/placeModel';
import { UsersController } from './presentation/controllers/users.controller';
import { AssociationRepository } from './infrastructure/repositories/associationRepository';
import { UsersService } from './services/users.service';
import { UserRepository } from './infrastructure/repositories/userRepository';
import { RegistrationTokenRepository } from './infrastructure/repositories/registrationCodeRepository';
import { RegistrationToken, RegistrationTokenSchema } from './infrastructure/models/registrationTokenModel';
import { AssociationsService } from './services/associations.service';
import { RegistrationTokenService } from './services/registration-token.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth.controller';
import { PlacesController } from './presentation/controllers/places.controller';
import { AssociationsController } from './presentation/controllers/associations.controller';
import { AuthService } from './services/auth.service';
import { PlaceCases } from './application/useCases/places';
import { IPlaceRepository } from './application/interfaces/placeRepository';
import { MongoosePlace, MongoosePlaceSchema } from './infrastructure/models/placeModel';
import { IAssociationRepository } from './application/interfaces/associationRepository';
import { IUserRepository } from './application/interfaces/userRepository';
import { MongooseAssociation, MongooseAssociationSchema } from './infrastructure/models/associationModel';
import { MongooseUser, MongooseUserSchema } from './infrastructure/models/userModel';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    MongooseModule.forFeature([
      { name: MongoosePlace.name, schema: MongoosePlaceSchema },
      { name: MongooseAssociation.name, schema: MongooseAssociationSchema },
      { name: MongooseUser.name, schema: MongooseUserSchema },
      { name: RegistrationToken.name, schema: RegistrationTokenSchema }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, UsersController, AuthController, PlacesController, AssociationsController],
  providers: [
    AppService, AuthService,
    AssociationRepository, AssociationsService,
    UsersService,
    RegistrationTokenService, RegistrationTokenRepository,
    PlaceCases,
    {
      provide: IPlaceRepository, // Used as a symbol
      useClass: PlaceRepository
    },
    {
      provide: IAssociationRepository,
      useClass: AssociationRepository
    },
    {
      provide: IUserRepository,
      useClass: UserRepository
    }],
})

export class AppModule { }