import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MongooseRegistrationToken } from "../models/registrationTokenModel";
import { IRegistrationTokensRepository } from "src/core/interfaces/registrationTokensRepository";
import { mapToRegistrationToken } from "../mappers/mongooseModelMappers";

@Injectable()
export class RegistrationTokensRepository implements IRegistrationTokensRepository {
  constructor(@InjectModel(MongooseRegistrationToken.name) private registrationTokenModel: Model<MongooseRegistrationToken>) {}

  async getByToken(token: string){
    const dbToken = await this.registrationTokenModel.findOne({ token}).exec();
    return token ? mapToRegistrationToken(dbToken?.toObject() as MongooseRegistrationToken) : null;
  }

  async create(request: Omit<MongooseRegistrationToken, 'id' | '_id'>) {
    const document = await this.registrationTokenModel.create(request);
    const createdToken = await this.registrationTokenModel.findOne({ _id: document._id }).exec();
    if (!createdToken) {
      throw new Error("Failed to fetch created token");
    }
    return mapToRegistrationToken(createdToken?.toObject() as MongooseRegistrationToken);
  }

  async delete(id: string) {
    await this.registrationTokenModel.deleteOne({_id: id});
  }

  async getForUser(userId: string) {
    const dbToken = await this.registrationTokenModel.findOne({ toUserId: userId }).exec();
    return dbToken ? mapToRegistrationToken(dbToken?.toObject() as MongooseRegistrationToken) : null;
  }
}