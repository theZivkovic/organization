import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MongoosePlace } from "../models/placeModel";
import { Model } from "mongoose";
import { IPlaceRepository } from "src/application/interfaces/placeRepository";
import { Place } from "src/core/entities/place";
import { mapToPlace } from "../mappers/mongooseModelMappers";

@Injectable()
export class PlaceRepository implements IPlaceRepository {
  constructor(@InjectModel(MongoosePlace.name) private placeModel: Model<MongoosePlace>) {}
  
  async getById(id: string): Promise<Place | null> {
    const dbPlace = await this.placeModel.findById(id).exec();
    return mapToPlace(dbPlace?.toObject() as MongoosePlace);
  };

  async getAllDescendants(placeLeft: number, placeRight: number): Promise<Place[]> {
    const dbPlaces = await this.placeModel.find({ 
        left: { $gte: placeLeft}, 
        right: {$lt: placeRight} 
    }).exec();
    return dbPlaces.map(x => mapToPlace(x?.toObject() as MongoosePlace));
  }

  async getPlaceAmongDescendants(placeLeft: number, placeRight: number, placeToGetId: string): Promise<Place | null>{
    const dbPlace = await this.placeModel.findOne({ 
        left: { $gte: placeLeft}, 
        right: {$lt: placeRight},
        _id: placeToGetId
    }).exec();
    return mapToPlace(dbPlace?.toObject() as MongoosePlace);
  }
}