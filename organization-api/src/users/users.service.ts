import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { UserDto } from './dtos/userDto';
import { userModelToDto } from './converters/userConverter';
import type {RegisterRequestDto} from './dtos/registerRequestDto';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository) {

    }

    async getByEmail(email: string): Promise<UserDto> {
        const foundUser = await this.userRepository.getByEmail(email);

        if (!foundUser){
            throw new NotFoundException();
        }

        return userModelToDto(foundUser);
    }

    async validate(email: string, password: string): Promise<boolean> {
        return this.userRepository.validate(email, password);
    }

    async register(request: RegisterRequestDto)
    {
        const existingUser = await this.userRepository.getByEmail(request.email);

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }
        
        return this.userRepository.create(request);
    }
}
