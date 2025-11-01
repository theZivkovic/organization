import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/infrastructure/models/userModel';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RegistrationTokenService } from 'src/registration-token/registration-token.service';
import { RegistrationTokenRepository } from 'src/infrastructure/repositories/registrationCodeRepository';
import { RegistrationToken, RegistrationTokenSchema } from 'src/infrastructure/models/registrationTokenModel';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RegistrationToken.name, schema: RegistrationTokenSchema }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' },
    }),
    ConfigModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, UserRepository, RegistrationTokenService, RegistrationTokenRepository],
})
export class AuthModule {}