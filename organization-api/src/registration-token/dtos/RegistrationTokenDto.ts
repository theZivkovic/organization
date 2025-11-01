import { CreateRegistrationTokenRequestDto } from "./CreateRegistrationTokenRequestDto"

export type RegistrationTokenDto = CreateRegistrationTokenRequestDto & {
    token: string;
    id: string;
}