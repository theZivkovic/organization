
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

@Schema()
export class User {
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
