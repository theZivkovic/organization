import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/infrastructure/models/userModel';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { RegistrationTokenService } from 'src/registration-token/registration-token.service';
import { RegistrationTokenRepository } from 'src/infrastructure/repositories/registrationCodeRepository';
import { RegistrationToken, RegistrationTokenSchema } from 'src/infrastructure/models/registrationTokenModel';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RegistrationToken.name, schema: RegistrationTokenSchema}
    ]),
    ConfigModule.forRoot()
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, RegistrationTokenService, RegistrationTokenRepository],
})

export class UsersModule {}
