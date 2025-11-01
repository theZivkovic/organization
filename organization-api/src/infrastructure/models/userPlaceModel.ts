
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PlaceType {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

@Schema()
export class UserPlace {
  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  placeId: string;
}

export const UserPlaceSchema = SchemaFactory.createForClass(UserPlace);
