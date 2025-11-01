import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RegistrationToken } from "../models/registrationTokenModel";

@Injectable()
export class RegistrationTokenRepository {
  constructor(@InjectModel(RegistrationToken.name) private registrationTokenModel: Model<RegistrationToken>) {}

  async create(request: Omit<RegistrationToken, 'id' | '_id'>) {
    const document = await this.registrationTokenModel.create(request);
    return {...request, _id: document._id};
  }

  async delete(id: string) {
    await this.registrationTokenModel.deleteOne({_id: id});
  }

  async getForUser(userId: string): Promise<RegistrationToken | null> {
    return this.registrationTokenModel.findOne({ toUserId: userId }).exec();
  }
}