
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum UserRole {
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

@Schema()
export class User {

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  get id() {
    return this._id;
  }

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  firstName: string;

  @Prop({required: true})
  lastName: string;

  @Prop({required: true})
  passwordHash: string;

  @Prop({required: true})
  passwordSalt: string;

  @Prop({required: true, enum: UserRole})
  role: UserRole;

}

export const UserSchema = SchemaFactory.createForClass(User);
