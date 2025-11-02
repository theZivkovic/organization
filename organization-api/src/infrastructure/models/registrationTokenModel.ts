

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'registrationtokens' })
export class RegistrationToken {

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
    _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true})
  issuingUserId: string;

  @Prop({required: true})
  toUserId: string;

  @Prop({required: true})
  token: string
}

export const RegistrationTokenSchema = SchemaFactory.createForClass(RegistrationToken);
