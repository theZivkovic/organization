import { PlaceDto } from "./placeDto";
import { UserDto } from "./userDto";

export type AssociationDto = {
    userId: string;
    placeId: string;
}

export type AssociationFullDto = AssociationDto & {
    user: UserDto,
    place: PlaceDto
}