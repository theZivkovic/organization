import { Module } from '@nestjs/common';
import { RegistrationTokenService } from './registration-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationToken, RegistrationTokenSchema } from 'src/infrastructure/models/registrationTokenModel';
import { RegistrationTokenRepository } from 'src/infrastructure/repositories/registrationCodeRepository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RegistrationToken.name, schema: RegistrationTokenSchema }]),
  ],
  controllers: [],
  providers: [RegistrationTokenService, RegistrationTokenRepository],
})

export class RegistrationTokenModule {}
