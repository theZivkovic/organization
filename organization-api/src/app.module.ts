import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';
import { PlaceSchema, Place } from './infrastructure/models/placeModel';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { PlacesService } from './places/places.service';
import { PlacesModule } from './places/places.module';
import { AssociationRepository } from './infrastructure/repositories/associationRepository';
import { Association, AssociationSchema } from './infrastructure/models/associationModel';
import { RegistrationTokenModule } from './registration-token/registration-token.module';
import { UsersService } from './users/users.service';
import { UserRepository } from './infrastructure/repositories/userRepository';
import { RegistrationTokenService } from './registration-token/registration-token.service';
import { RegistrationTokenRepository } from './infrastructure/repositories/registrationCodeRepository';
import { User, UserSchema } from './infrastructure/models/userModel';
import { RegistrationToken, RegistrationTokenSchema } from './infrastructure/models/registrationTokenModel';

@Module({
  imports: [
      MongooseModule.forRoot(process.env.MONGO_URL as string),
      MongooseModule.forFeature([
        { name: Place.name, schema: PlaceSchema},
        { name: Association.name, schema: AssociationSchema },
        { name: User.name, schema: UserSchema },
        { name: RegistrationToken.name, schema: RegistrationTokenSchema }
      ]),
      ConfigModule.forRoot(),
      AuthModule,
      UsersModule,
      PlacesModule,
      RegistrationTokenModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, PlaceRepository, AssociationRepository, PlacesService, UsersService, UserRepository, RegistrationTokenService, RegistrationTokenRepository],
})

export class AppModule {}