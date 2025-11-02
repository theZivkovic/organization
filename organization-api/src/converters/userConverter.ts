import { UserDto, UserRoleDto } from "src/dtos/userDto";
import { User } from "src/infrastructure/models/userModel";

export function userModelToDto(user: User): UserDto{
    return {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as unknown as UserRoleDto
    };
}