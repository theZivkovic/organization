import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlacesRepository } from './infrastructure/repositories/placesRepository';
import { UsersController } from './presentation/controllers/users.controller';
import { AssociationsRepository } from './infrastructure/repositories/associationsRepository';
import { UsersRepository } from './infrastructure/repositories/usersRepository';
import { RegistrationTokensRepository } from './infrastructure/repositories/registrationTokensRepository';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './presentation/controllers/auth.controller';
import { PlacesController } from './presentation/controllers/places.controller';
import { AssociationsController } from './presentation/controllers/associations.controller';
import { AuthService } from './presentation/services/auth.service';
import { PlaceUseCases } from './application/useCases/placesUseCases';
import { IPlacesRepository } from './core/interfaces/placesRepository';
import { MongoosePlace, MongoosePlaceSchema } from './infrastructure/models/placeModel';
import { IAssociationsRepository } from './core/interfaces/associationsRepository';
import { IUsersRepository } from './core/interfaces/usersRepository';
import { MongooseAssociation, MongooseAssociationSchema } from './infrastructure/models/associationModel';
import { MongooseUser, MongooseUserSchema } from './infrastructure/models/userModel';
import { AuthUseCases } from './application/useCases/authUseCases';
import { IRegistrationTokensRepository } from './core/interfaces/registrationTokensRepository';
import { MongooseRegistrationToken, MongooseRegistrationTokenSchema } from './infrastructure/models/registrationTokenModel';
import { RegistationTokensUseCases } from './application/useCases/registrationTokensUseCases';
import { UsersUseCases } from './application/useCases/usersUseCases';
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
    AssociationsRepository,
    PlaceUseCases, AuthUseCases, RegistationTokensUseCases, UsersUseCases, AssociationsUseCases,
    {
      provide: IPlacesRepository,
      useClass: PlacesRepository
    },
    {
      provide: IAssociationsRepository,
      useClass: AssociationsRepository
    },
    {
      provide: IUsersRepository,
      useClass: UsersRepository
    },
    {
      provide: IRegistrationTokensRepository,
      useClass: RegistrationTokensRepository
    }],
})

export class AppModule { }