import { UserRole } from "src/core/enums/userRole"

export type CreateRegistrationTokenRequestDto = {
    toUserEmail: string,
    toUserRole: UserRole
}