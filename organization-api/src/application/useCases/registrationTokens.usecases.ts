import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUsersRepository } from "../../core/interfaces/usersRepository";
import { IRegistrationTokensRepository } from "../../core/interfaces/registrationTokensRepository";
import { RegistrationToken } from "../../core/entities/registrationToken";
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from "../../core/enums/userRole";

@Injectable()
export class RegistationTokensUseCases {

    constructor(
        @Inject(IRegistrationTokensRepository) private readonly registrationTokensRepository: IRegistrationTokensRepository,
        @Inject(IUsersRepository) private readonly usersRepository: IUsersRepository) {
    }

    async getRegistrationTokenByToken(token: string): Promise<RegistrationToken> {
        const registrationToken = await this.registrationTokensRepository.getByToken(token);

        if (!registrationToken) {
            throw new NotFoundException(`Registration token: ${token} not found`);
        }

        return registrationToken;
    }

    async recreateRegistrationToken(issuingUserId: string, toUserEmail: string, toUserRole: UserRole): Promise<RegistrationToken> {
        const existingToUser = await this.usersRepository.getByEmailWithCredentials(toUserEmail);

        if (existingToUser?.passwordHash){
            throw new ConflictException(`User: ${toUserEmail} already registered`);
        }
        
        const toUser = existingToUser ??
        await this.usersRepository.create({
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

