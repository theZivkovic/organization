import { RegistrationToken } from "src/infrastructure/models/registrationTokenModel";
import { RegistrationTokenDto } from "../dtos/registrationTokenDto";


export function registrationTokenModelToDto(token: RegistrationToken): RegistrationTokenDto {
    return {
        issuingUserId: token.issuingUserId,
        toUserId: token.toUserId,
        token: token.token,
        id: token._id.toString(),
    };
}