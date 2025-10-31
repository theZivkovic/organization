import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { User, UserSchema } from 'src/infrastructure/models/userModel';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}