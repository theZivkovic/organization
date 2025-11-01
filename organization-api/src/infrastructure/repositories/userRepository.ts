import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserRole } from "../models/userModel";
import { comparePassword, generateSaltAndHash } from "src/utils/passwordHelper";
import { UserDto } from "src/users/dtos/userDto";
import { userModelToDto } from "src/users/converters/userConverter";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  };

  getById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  };

  async getAllByIds(ids: Array<string>): Promise<Array<User>> {
    return (await this.userModel.find( {_id: { $in: ids}}).exec());
  }

  async create(request: Partial<Omit<User, "_id">>): Promise<User> {
    const document = await this.userModel.create(request);
    const createdUser = await this.userModel.findOne({ _id: document._id }).exec();
    if (!createdUser) {
      throw new Error("Failed to fetch created user");
    }
    return createdUser.toObject() as User;
  }

  async update(id: string, request: Partial<Omit<User, "_id">>): Promise<User>{
    await this.userModel.updateOne({ _id: id}, request).exec();
    const updatedUser = await this.userModel.findOne({ _id: id }).exec();
    if (!updatedUser) {
      throw new Error("Failed to fetch updated user");
    }
    return updatedUser.toObject() as User;
  }

  async validate(email: string, rawPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({email}).exec();

    if (!user) {
      return false;
    }

    return comparePassword(user.passwordHash, user.passwordSalt, rawPassword);
  }
}