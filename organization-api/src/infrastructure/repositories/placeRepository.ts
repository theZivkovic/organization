import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Place } from "../models/placeModel";
import { Model } from "mongoose";

@Injectable()
export class PlaceRepository {
  constructor(@InjectModel(Place.name) private placeModel: Model<Place>) {}

  countNodes(): Promise<number> {
    return this.placeModel.countDocuments().exec();
  }

  getByName(name: string): Promise<Place | null> {
    return this.placeModel.findOne({ name }).exec();
  };

  getById(id: string): Promise<Place | null> {
    return this.placeModel.findById(id).exec();
  };

  getAllDescendants(place: Place): Promise<Place[]> {
    return this.placeModel.find({ 
        left: { $gte: place.left}, 
        right: {$lt: place.right} 
    }).exec();
  }
}