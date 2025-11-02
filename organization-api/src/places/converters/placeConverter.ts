import { Place } from "src/infrastructure/models/placeModel";
import { PlaceDto, PlaceTypeDto } from "../dtos/placeDto";
import { Association } from "src/infrastructure/models/associationModel";
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

export function placeModelToFullDto(place: Place, associations: Array<Association>, users: Array<User>): PlaceFullDto {
    const placeDto = placeModelToDto(place);
    const associationsForPlace = associations.filter(x => x.placeId === placeDto.id);
    const usersForPlace = users.filter(x => associationsForPlace.some(y => y.userId === x._id.toString()));
    return {
        ...placeDto,
        users: usersForPlace.map(x => userModelToDto(x))
    }
};
