
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum UserRole {
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

@Schema({ collection: 'users' })
export class MongooseUser {

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true})
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  passwordHash: string;

  @Prop()
  passwordSalt: string;

  @Prop({required: true, enum: UserRole})
  role: UserRole;

}

export const MongooseUserSchema = SchemaFactory.createForClass(MongooseUser);
