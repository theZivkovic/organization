import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PlaceRepository } from './infrastructure/repositories/placeRepository';
import { PlaceSchema, Place } from './infrastructure/models/placeModel';
import { UserModule } from './auth/auth.module';

@Module({
  imports: [
      MongooseModule.forRoot(process.env.MONGO_URL as string),
      MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema}]),
      ConfigModule.forRoot(),
      UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PlaceRepository],
})

export class AppModule {}