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

  async create({email, firstName, lastName, password, role}: {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: string
  }) {
    const { salt, hash } = await generateSaltAndHash(password);

    const newUser: Omit<User, 'id' | '_id'> = {
        email,
        passwordHash: hash,
        passwordSalt: salt,
        firstName,
        lastName,
        role: role as UserRole
    }
    
    await this.userModel.create(newUser);
    return newUser;
  }

  async validate(email: string, rawPassword: string): Promise<boolean> {
    const user = await this.userModel.findOne({email}).exec();

    if (!user) {
      return false;
    }

    return comparePassword(user.passwordHash, user.passwordSalt, rawPassword);
  }
}