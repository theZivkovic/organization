
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PlaceType {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

@Schema()
export class UserPlace {
  @Prop({required: true})
  userEmail: string;

  @Prop({required: true})
  placeName: string;
}

export const UserPlaceSchema = SchemaFactory.createForClass(UserPlace);
