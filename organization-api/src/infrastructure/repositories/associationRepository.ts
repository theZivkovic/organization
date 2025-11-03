import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {  MongooseAssociation } from "../models/associationModel";
import { Association } from "src/core/entities/association";
import { mapToAssociation } from "../mappers/mongooseModelMappers";
import { IAssociationRepository } from "src/core/interfaces/associationRepository";

@Injectable()
export class AssociationRepository implements IAssociationRepository {
  constructor(@InjectModel(MongooseAssociation.name) private associationModel: Model<MongooseAssociation>) {}

  async get(userId: string, placeId: string): Promise<Association | null> {
    const dbAssociation = await this.associationModel.findOne({ userId, placeId }).exec();
    return dbAssociation ? mapToAssociation(dbAssociation.toObject() as MongooseAssociation) : null;
  }

  async getForUser(userId: string): Promise<Association | null> {
    const dbAssociation = await this.associationModel.findOne({ userId }).exec();
    return dbAssociation ? mapToAssociation(dbAssociation.toObject() as MongooseAssociation): null;
  };

  async getAllForPlaces(placeIds: Array<string>): Promise<Array<Association>> {
    const dbAssociations = await this.associationModel.find({ placeId: { $in: placeIds }}).exec();
    return dbAssociations.map(x => mapToAssociation(x?.toObject() as MongooseAssociation));
  }

  async create(userId: string, placeId: string): Promise<Association> {
    // TODO: try to drop get here
    const document = await this.associationModel.create({ userId, placeId});
    const createdAssociation = await this.associationModel.findOne({ _id: document._id }).exec();
    if (!createdAssociation) {
      throw new Error("Failed to fetch created association");
    }
    return mapToAssociation(createdAssociation?.toObject() as MongooseAssociation);
  }

  async delete(userId: string, placeId: string) {
    await this.associationModel.deleteOne({ userId, placeId});
  }
}