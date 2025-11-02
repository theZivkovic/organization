import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Association } from "../models/associationModel";

@Injectable()
export class AssociationRepository {
  constructor(@InjectModel(Association.name) private associationModel: Model<Association>) {}

  get(userId: string, placeId: string): Promise<Association | null> {
    return this.associationModel.findOne({ userId, placeId }).exec();
  }

  getForUser(userId: string): Promise<Association | null> {
    return this.associationModel.findOne({ userId }).exec();
  };

  getAllForPlaces(placeIds: Array<string>): Promise<Array<Association>> {
    return this.associationModel.find({ placeId: { $in: placeIds }}).exec();
  }

  async create(userId: string, placeId: string): Promise<Association> {
    // TODO: try to drop get here
    const document = await this.associationModel.create({ userId, placeId});
    const createdAssociation = await this.associationModel.findOne({ _id: document._id }).exec();
    if (!createdAssociation) {
      throw new Error("Failed to fetch created association");
    }
    return createdAssociation.toObject() as Association;
  }

  async delete(userId: string, placeId: string) {
    await this.associationModel.deleteOne({ userId, placeId});
  }
}