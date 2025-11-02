import { PlaceType } from "../enums/placeType";
import { User } from "./user";

export interface Place {
    id: string;
    name: string;
    type: PlaceType;
    left: number;
    right: number;
    users?: Array<User>
}