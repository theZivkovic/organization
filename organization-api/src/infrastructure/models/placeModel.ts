
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PlaceType {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

@Schema()
export class Place {
  @Prop({required: true})
  name: string;

  @Prop({required: true, enum: PlaceType})
  type: PlaceType;

  @Prop()
  left: number;
  
  @Prop()
  right: number;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
