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

@Module({
  imports: [
      MongooseModule.forRoot(process.env.MONGO_URL as string),
      MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema}]),
      ConfigModule.forRoot(),
      AuthModule,
      UsersModule,
      PlacesModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, PlaceRepository, PlacesService],
})

export class AppModule {}