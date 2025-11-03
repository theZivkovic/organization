import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IUserRepository } from "../../core/interfaces/userRepository";
import { comparePassword, User } from "src/core/entities/user";

@Injectable()
export class AuthCases {

    constructor (
        @Inject(IUserRepository) private readonly userRepository: IUserRepository, ) {
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

