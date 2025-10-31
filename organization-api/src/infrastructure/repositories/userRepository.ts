import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../models/userModel";
import { comparePassword } from "src/utils/passwordHelper";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  };

  async validate(email: string, rawPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({email}).exec();

    if (!user) {
      return false;
    }

    return comparePassword(user.passwordHash, user.passwordSalt, rawPassword);
  }
}