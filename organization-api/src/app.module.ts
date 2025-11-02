import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';
import { PlaceSchema, Place } from './infrastructure/models/placeModel';
import { UsersController } from './controllers/users.controller';
import { PlacesService } from './services/places.service';
import { AssociationRepository } from './infrastructure/repositories/associationRepository';
import { Association, AssociationSchema } from './infrastructure/models/associationModel';
import { UsersService } from './services/users.service';
import { UserRepository } from './infrastructure/repositories/userRepository';
import { RegistrationTokenRepository } from './infrastructure/repositories/registrationCodeRepository';
import { User, UserSchema } from './infrastructure/models/userModel';
import { RegistrationToken, RegistrationTokenSchema } from './infrastructure/models/registrationTokenModel';
import { AssociationsService } from './services/associations.service';
import { RegistrationTokenService } from './services/registration-token.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { PlacesController } from './controllers/places.controller';
import { AssociationsController } from './controllers/associations.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Association.name, schema: AssociationSchema },
      { name: User.name, schema: UserSchema },
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
    PlaceRepository, PlacesService,
    AssociationRepository, AssociationsService,
    UsersService, UserRepository,
    RegistrationTokenService, RegistrationTokenRepository],
})

export class AppModule { }