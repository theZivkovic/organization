import { Place } from "src/infrastructure/models/placeModel";
import { PlaceDto, PlaceTypeDto } from "../dtos/placeDto";
import { Association } from "src/infrastructure/models/associationModel";
import { User } from "src/infrastructure/models/userModel";
import { userModelToDto } from "src/users/converters/userConverter";
import { PlaceFullDto } from "../dtos/placeFullDto";
import { AssociationDto } from "src/associations/dtos/associationDto";
import { UserDto } from "src/users/dtos/userDto";

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
