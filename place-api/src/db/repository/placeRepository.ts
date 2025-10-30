import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Place } from "../schemas/placeSchema";
import { Model } from "mongoose";

@Injectable()
export class PlaceRepository {
  constructor(@InjectModel(Place.name) private placeModel: Model<Place>) {}

  countNodes(): Promise<number> {
    return this.placeModel.countDocuments().exec();
  }

  findByName(name: string): Promise<Place | null> {
    return this.placeModel.findOne({ name }).exec();
  };

  findAllDescendants(place: Place): Promise<Place[]> {
    return this.placeModel.find({ 
        left: { $gte: place.left}, 
        right: {$lt: place.right} 
    }).exec();
  }
}