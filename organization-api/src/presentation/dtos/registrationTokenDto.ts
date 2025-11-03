import { CreateRegistrationTokenRequestDto } from "./createRegistrationTokenRequestDto"

export type RegistrationTokenDto = CreateRegistrationTokenRequestDto & {
    token: string;
    id: string;
}