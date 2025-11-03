import { Place } from "src/core/entities/place";

export interface IPlacesRepository {
   getById(id: string): Promise<Place | null>;
   getAllDescendants(placeLeft: number, placeRight: number): Promise<Place[]>;
   getPlaceAmongDescendants(placeLeft: number, placeRight: number, placeToGetId: string);
}

export const IPlacesRepository = Symbol("IPlacesRepository");