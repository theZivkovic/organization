
import { UserDto } from "src/users/dtos/userDto"
import { PlaceDto } from "./placeDto"


export type PlaceFullDto = PlaceDto & {
    users: Array<UserDto>
}