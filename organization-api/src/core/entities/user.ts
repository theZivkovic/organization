import { UserRole } from "../enums/userRole";
import { Place } from "./place";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    passwordSalt: string;
    role: UserRole;
    place?: Place;
}