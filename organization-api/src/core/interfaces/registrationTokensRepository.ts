import { RegistrationToken } from "src/core/entities/registrationToken";

export interface IRegistrationTokensRepository {
    getByToken(token: string): Promise<RegistrationToken | null>;
    create(request: Omit<RegistrationToken, 'id'>): Promise<RegistrationToken>;
    delete(id: string): Promise<void>;
    getForUser(userId: string): Promise<RegistrationToken | null>;
}

export const IRegistrationTokensRepository = Symbol("IRegistrationTokensRepository");