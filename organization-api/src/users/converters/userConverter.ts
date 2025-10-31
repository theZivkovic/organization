import { User } from "src/infrastructure/models/userModel";
import { UserDto } from "../dtos/userDto";

export function userModelToDto(user: User): UserDto{
    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    };
}