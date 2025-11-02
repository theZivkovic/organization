
import { UserDto } from "src/dtos/userDto"
import { PlaceDto } from "./placeDto"


export type PlaceFullDto = PlaceDto & {
    users: Array<UserDto>
}