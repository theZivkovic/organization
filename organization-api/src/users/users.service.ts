import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { UserDto } from './dtos/userDto';
import { userModelToDto } from './converters/userConverter';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository) {

    }

    async getByEmail(email: string): Promise<UserDto> {
        const foundUser = await this.userRepository.findByEmail(email);

        if (!foundUser){
            throw new NotFoundException();
        }

        return userModelToDto(foundUser);
    }

    async validate(email: string, password: string): Promise<boolean> {
        return this.userRepository.validate(email, password);
    }
}
