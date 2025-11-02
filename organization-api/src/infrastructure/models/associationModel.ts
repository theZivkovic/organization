
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Association {
  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  placeId: string;
}

export const AssociationSchema = SchemaFactory.createForClass(Association);
