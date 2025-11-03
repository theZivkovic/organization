import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUsersRepository } from "../../core/interfaces/usersRepository";
import { IRegistrationTokensRepository } from "../../core/interfaces/registrationTokensRepository";
import { generateSaltAndHash } from "src/core/entities/userWithCredentials";

@Injectable()
export class UsersUseCases {

    constructor(
        @Inject(IRegistrationTokensRepository) private readonly registrationTokensRepository: IRegistrationTokensRepository,
        @Inject(IUsersRepository) private readonly usersRepository: IUsersRepository) {
    }

    async register(token: string, firstName: string, lastName: string, password: string) {
        const registrationToken = await this.registrationTokensRepository.getByToken(token);

        if (!registrationToken){
            throw new NotFoundException(`Registration token not found for the given token`);
        }

        const { hash, salt } = await generateSaltAndHash(password);
        const updatedUser = await this.usersRepository.update(
            registrationToken.toUserId,
            {
                firstName: firstName,
                lastName: lastName,
                passwordHash: hash,
                passwordSalt: salt
            }
        );
        await this.registrationTokensRepository.delete(registrationToken.id);

        return updatedUser;
    }
}

