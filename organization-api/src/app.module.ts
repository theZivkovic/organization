import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';
import { PlaceSchema, Place } from './infrastructure/models/placeModel';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
      MongooseModule.forRoot(process.env.MONGO_URL as string),
      MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema}]),
      ConfigModule.forRoot(),
      AuthModule,
      UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PlaceRepository],
})

export class AppModule {}