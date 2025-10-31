import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { User, UserSchema } from 'src/infrastructure/models/userModel';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class UserModule {}