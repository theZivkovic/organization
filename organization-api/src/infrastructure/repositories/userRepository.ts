import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../models/userModel";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  };

  
}