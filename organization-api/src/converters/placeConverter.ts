import { Place } from "src/infrastructure/models/placeModel";
import { AssociationDto } from "src/dtos/associationDto";
import { UserDto } from "src/dtos/userDto";
import { PlaceDto, PlaceTypeDto } from "src/dtos/placeDto";
import { PlaceFullDto } from "src/dtos/placeFullDto";

export function placeModelToDto(place: Place): PlaceDto {
    return {
        id: place._id.toString(),
        name: place.name,
        type: place.type as unknown as PlaceTypeDto,
        left: place.left,
        right: place.right
    };
}

export function placeModelToFullDto(placeDto: PlaceDto, associationsDtos: Array<AssociationDto>, usersDtos: Array<UserDto>): PlaceFullDto {
    const associationsForPlace = associationsDtos.filter(x => x.placeId === placeDto.id);
    const usersForPlace = usersDtos.filter(x => associationsForPlace.some(y => y.userId === x.id));
    return {
        ...placeDto,
        users: usersForPlace
    }
};
