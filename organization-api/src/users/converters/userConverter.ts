import { User } from "src/infrastructure/models/userModel";
import { UserDto, UserRoleDto } from "../dtos/userDto";

export function userModelToDto(user: User): UserDto{
    return {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as unknown as UserRoleDto
    };
}