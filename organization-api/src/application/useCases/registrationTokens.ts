import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "../interfaces/userRepository";
import { IRegistrationTokenRepository } from "../interfaces/registrationgTokenRepository";
import { RegistrationToken } from "src/core/entities/registrationToken";
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from "src/core/enums/userRole";

@Injectable()
export class RegistationTokensCases {

    constructor(
        @Inject(IRegistrationTokenRepository) private readonly registrationTokensRepository: IRegistrationTokenRepository,
        @Inject(IUserRepository) private readonly usersRepository: IUserRepository) {
    }

    async getRegistrationTokenByToken(token: string): Promise<RegistrationToken> {
        const registrationToken = await this.registrationTokensRepository.getByToken(token);

        if (!registrationToken) {
            throw new NotFoundException(`Registration token: ${token} not found`);
        }

        return registrationToken;
    }

    async recreateRegistrationToken(issuingUserId: string, toUserEmail: string, toUserRole: UserRole): Promise<RegistrationToken> {
        const toUser = await this.usersRepository.getByEmail(toUserEmail)
            ?? await this.usersRepository.create({
                email: toUserEmail,
                role: toUserRole
            });

        const existingToken = await this.registrationTokensRepository.getForUser(toUser.id);

        if (existingToken) {
            await this.registrationTokensRepository.delete(existingToken.id);
        }

        const newToken = uuidv4();
        return this.registrationTokensRepository.create({
            issuingUserId,
            toUserId: toUser.id,
            token: newToken
        });
    }
}

