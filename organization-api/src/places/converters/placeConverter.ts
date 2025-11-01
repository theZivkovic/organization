import { Place, PlaceType } from "src/infrastructure/models/placeModel";
import { PlaceDto, PlaceTypeDto } from "../dtos/placeDto";
import { UserPlace } from "src/infrastructure/models/userPlaceModel";
import { User } from "src/infrastructure/models/userModel";
import { userModelToDto } from "src/users/converters/userConverter";
import { PlaceFullDto } from "../dtos/placeFullDto";

export function placeModelToDto(place: Place): PlaceDto {
    return {
        id: place._id.toString(),
        name: place.name,
        type: place.type as unknown as PlaceTypeDto
    };
}

export function placeModelToFullDto(place: Place, userPlaces: Array<UserPlace>, users: Array<User>): PlaceFullDto {
    const placeDto = placeModelToDto(place);
    const userPlacesForPlace = userPlaces.filter(x => x.placeId === placeDto.id);
    const usersForPlace = users.filter(x => userPlacesForPlace.some(y => y.userId === x._id.toString()));
    return {
        ...placeDto,
        users: usersForPlace.map(x => userModelToDto(x))
    }
};
