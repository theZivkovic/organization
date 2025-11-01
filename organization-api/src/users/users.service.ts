import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { UserDto, UserRoleDto } from './dtos/userDto';
import { userModelToDto } from './converters/userConverter';
import { RegistrationTokenService } from 'src/registration-token/registration-token.service';
import { UserRole } from 'src/infrastructure/models/userModel';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository, private registrationTokenService: RegistrationTokenService) {

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

    async register(request: { issuingUserId: string, toUserEmail: string, toUserRole: UserRoleDto })
    {
        const toUser = await this.userRepository.getByEmail(request.toUserEmail) 
        ?? await this.userRepository.create({
            email: request.toUserEmail, 
            role: request.toUserRole as unknown as UserRole,
        });

        const registrationToken = await this.registrationTokenService.create({
            issuingUserId: request.issuingUserId,
            toUserId: toUser?._id.toString(),
        });

        return { registrationToken, toUser };
    }
}
