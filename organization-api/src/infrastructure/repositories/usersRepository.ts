import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUsersRepository } from "src/core/interfaces/usersRepository";
import { MongooseUser } from "../models/userModel";
import { User } from "src/core/entities/user";
import { UserRole } from "src/core/enums/userRole";
import { mapToUser } from "../mappers/mongooseModelMappers";

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(@InjectModel(MongooseUser.name) private userModel: Model<MongooseUser>) {}

  async getByEmail(email: string): Promise<User | null> {
    const dbUser = await this.userModel.findOne({ email }).exec();
    return dbUser ? mapToUser(dbUser.toObject() as MongooseUser) : null;
  };

  async getById(id: string): Promise<User | null> {
    const dbUser = await this.userModel.findById(id).exec();
    return dbUser ? mapToUser(dbUser.toObject() as MongooseUser) : null;
  };

  async getAllByIds(ids: Array<string>): Promise<Array<User>> {
    const dbUsers = await this.userModel.find( {_id: { $in: ids}}).exec();
    return dbUsers.map(x => mapToUser(x?.toObject() as MongooseUser));
  }

  async getAllByIdsWithRole(ids: Array<string>, role: UserRole): Promise<Array<User>> {
     const dbUsers = await this.userModel.find( {_id: { $in: ids}, role}).exec();
     return dbUsers.map(x => mapToUser(x?.toObject() as MongooseUser));
  }

  async create(request: Partial<Omit<User, "_id">>): Promise<User> {
    const document = await this.userModel.create(request);
    const createdUser = await this.userModel.findOne({ _id: document._id }).exec();
    if (!createdUser) {
      throw new Error("Failed to fetch created user");
    }
    return mapToUser(createdUser?.toObject() as MongooseUser);
  }

  async update(id: string, request: Partial<Omit<User, "_id">>): Promise<User>{
    await this.userModel.updateOne({ _id: id}, request).exec();
    const updatedUser = await this.userModel.findOne({ _id: id }).exec();
    if (!updatedUser) {
      throw new Error("Failed to fetch updated user");
    }
    return mapToUser(updatedUser?.toObject() as MongooseUser);
  }
}