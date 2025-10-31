
export enum UserRoleDto {
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE"
}

export type UserDto = {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRoleDto
}