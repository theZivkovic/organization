import { UserDto } from "./userDto";

export enum PlaceTypeDto {
    OFFICE = "OFFICE",
    STORE = "STORE"
};

export type PlaceDto = {
    id: string;
    name: string;
    type: PlaceTypeDto;
    left: number;
    right: number;
}

export type PlaceFullDto = PlaceDto & {
    users: Array<UserDto>
}