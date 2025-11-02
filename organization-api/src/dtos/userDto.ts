import { PlaceDto } from "./placeDto";

export enum UserRoleDto {
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

export type UserDto = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRoleDto
}

export type UserWithPlaceDto = UserDto & {
    place: PlaceDto
}