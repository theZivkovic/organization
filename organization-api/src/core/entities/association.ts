import { Place } from "./place";
import { User } from "./user";

export interface Association {
    userId: string,
    placeId: string,
    user?: User;
    place?: Place;
}