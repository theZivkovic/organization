import { UserRoleDto } from "./userDto";

export type RegisterRequestDto = {
    token: string;
    password: string;
    firstName: string;
    lastName: string;
}