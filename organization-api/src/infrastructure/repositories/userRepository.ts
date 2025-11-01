import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserRole } from "../models/userModel";
import { comparePassword, generateSaltAndHash } from "src/utils/passwordHelper";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  };

  async create(request: Partial<Omit<User, "_id">>): Promise<User>
  {
    const document = await this.userModel.create(request);
    const createdUser = await this.userModel.findOne({ _id: document._id }).exec();
    if (!createdUser) {
      throw new Error("Failed to fetch created user");
    }
    return createdUser.toObject() as User;
  }

  async validate(email: string, rawPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({email}).exec();

    if (!user) {
      return false;
    }

    return comparePassword(user.passwordHash, user.passwordSalt, rawPassword);
  }
}