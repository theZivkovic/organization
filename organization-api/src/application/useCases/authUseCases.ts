import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IUsersRepository } from "../../core/interfaces/usersRepository";
import { comparePassword, User } from "src/core/entities/user";

@Injectable()
export class AuthUseCases {

    constructor (
        @Inject(IUsersRepository) private readonly userRepository: IUsersRepository, ) {
    }

    async getUserByCredentials(email: string, password: string): Promise<User> {
        const user = await this.userRepository.getByEmail(email);

        if (!user){
            throw new NotFoundException(`User with email: ${email} not found`);
        }

        if (!await comparePassword(user.passwordHash, user.passwordSalt, password)){
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}

