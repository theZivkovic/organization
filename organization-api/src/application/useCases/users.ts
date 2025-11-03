import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUserRepository } from "../../core/interfaces/userRepository";
import { IRegistrationTokenRepository } from "../../core/interfaces/registrationgTokenRepository";
import { RegistrationToken } from "src/core/entities/registrationToken";
import { v4 as uuidv4 } from 'uuid'; 
import { UserRole } from "src/core/enums/userRole";
import { generateSaltAndHash } from "src/core/entities/user";

@Injectable()
export class UsersCases {

    constructor(
        @Inject(IRegistrationTokenRepository) private readonly registrationTokensRepository: IRegistrationTokenRepository,
        @Inject(IUserRepository) private readonly usersRepository: IUserRepository) {
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

        return updatedUser;
    }
}

