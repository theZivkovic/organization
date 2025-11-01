import { UserRoleDto } from "./userDto";

export type RegisterRequestDto = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRoleDto;
}