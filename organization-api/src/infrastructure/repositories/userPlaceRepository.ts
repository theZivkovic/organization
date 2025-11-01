import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserPlace } from "../models/userPlaceModel";

@Injectable()
export class UserPlaceRepository {
  constructor(@InjectModel(UserPlace.name) private userPlaceModel: Model<UserPlace>) {}

  get(userId: string, placeId: string): Promise<UserPlace | null> {
    return this.userPlaceModel.findOne({ userId, placeId }).exec();
  }

  getForUser(userId: string): Promise<UserPlace | null> {
    return this.userPlaceModel.findOne({ userId }).exec();
  };

  getAllForPlaces(placeIds: Array<string>): Promise<Array<UserPlace>> {
    return this.userPlaceModel.find({ placeId: { $in: placeIds }}).exec();
  }
}