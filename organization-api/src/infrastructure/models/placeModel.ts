
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum PlaceType {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

@Schema()
export class Place {


  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

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
