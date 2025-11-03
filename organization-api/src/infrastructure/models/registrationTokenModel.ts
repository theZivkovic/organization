

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'registrationtokens' })
export class MongooseRegistrationToken {

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true})
  issuingUserId: string;

  @Prop({required: true})
  toUserId: string;

  @Prop({required: true})
  token: string
}

export const MongooseRegistrationTokenSchema = SchemaFactory.createForClass(MongooseRegistrationToken);
