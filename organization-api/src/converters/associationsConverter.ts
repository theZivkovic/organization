import { Association } from "src/infrastructure/models/associationModel";
import { AssociationDto, AssociationFullDto } from "../dtos/associationDto";
import { UserDto } from "src/dtos/userDto";
import { PlaceDto } from "src/dtos/placeDto";

export function associationModelToDto(association: Association): AssociationDto {
    return {
       userId: association.userId,
       placeId: association.placeId
    };
}

export function associationModelToFullDto(user: UserDto, place: PlaceDto): AssociationFullDto {
    return {
       userId: user.id,
       placeId: place.id,
       user,
       place
    };
}

