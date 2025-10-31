import { Place, PlaceType } from "src/infrastructure/models/placeModel";
import { PlaceDto, PlaceTypeDto } from "../dtos/placeDto";

export function placeModelToDto(place: Place): PlaceDto{
    return {
        name: place.name,
        type: place.type as unknown as PlaceTypeDto
    };
}