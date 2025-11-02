
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'associations' })
export class MongooseAssociation {
  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  placeId: string;
}

export const MongooseAssociationSchema = SchemaFactory.createForClass(MongooseAssociation);
