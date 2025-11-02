import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Place } from "../models/placeModel";
import { Model } from "mongoose";

@Injectable()
export class PlaceRepository {
  constructor(@InjectModel(Place.name) private placeModel: Model<Place>) {}
  
  getById(id: string): Promise<Place | null> {
    return this.placeModel.findById(id).exec();
  };

  getAllDescendants(placeLeft: number, placeRight: number): Promise<Place[]> {
    return this.placeModel.find({ 
        left: { $gte: placeLeft}, 
        right: {$lt: placeRight} 
    }).exec();
  }

  getPlaceAmongDescendants(placeLeft: number, placeRight: number, placeToGetId: string): Promise<Place | null>{
    return this.placeModel.findOne({ 
        left: { $gte: placeLeft}, 
        right: {$lt: placeRight},
        _id: placeToGetId
    }).exec();
  }
}