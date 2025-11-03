import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';
import { UsersController } from './presentation/controllers/users.controller';
import { AssociationRepository } from './infrastructure/repositories/associationRepository';
import { UserRepository } from './infrastructure/repositories/userRepository';
import { RegistrationTokenRepository } from './infrastructure/repositories/registrationTokenRepository';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth.controller';
import { PlacesController } from './presentation/controllers/places.controller';
import { AssociationsController } from './presentation/controllers/associations.controller';
import { AuthService } from './presentation/services/auth.service';
import { PlaceUseCases } from './application/useCases/placesUseCases';
import { IPlaceRepository } from './core/interfaces/placeRepository';
import { MongoosePlace, MongoosePlaceSchema } from './infrastructure/models/placeModel';
import { IAssociationRepository } from './core/interfaces/associationRepository';
import { IUserRepository } from './core/interfaces/userRepository';
import { MongooseAssociation, MongooseAssociationSchema } from './infrastructure/models/associationModel';
import { MongooseUser, MongooseUserSchema } from './infrastructure/models/userModel';
import { AuthUseCases } from './application/useCases/authUseCases';
import { IRegistrationTokenRepository } from './core/interfaces/registrationgTokenRepository';
import { MongooseRegistrationToken, MongooseRegistrationTokenSchema } from './infrastructure/models/registrationTokenModel';
import { RegistationTokensUseCases } from './application/useCases/registrationTokensUseCases';
import { UsersUseCases } from './application/useCases/users';
import { AssociationsUseCases } from './application/useCases/associationsUseCases';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    MongooseModule.forFeature([
      { name: MongoosePlace.name, schema: MongoosePlaceSchema },
      { name: MongooseAssociation.name, schema: MongooseAssociationSchema },
      { name: MongooseUser.name, schema: MongooseUserSchema },
      { name: MongooseRegistrationToken.name, schema: MongooseRegistrationTokenSchema }
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
    AssociationRepository,
    PlaceUseCases, AuthUseCases, RegistationTokensUseCases, UsersUseCases, AssociationsUseCases,
    {
      provide: IPlaceRepository,
      useClass: PlaceRepository
    },
    {
      provide: IAssociationRepository,
      useClass: AssociationRepository
    },
    {
      provide: IUserRepository,
      useClass: UserRepository
    },
    {
      provide: IRegistrationTokenRepository,
      useClass: RegistrationTokenRepository
    }],
})

export class AppModule { }