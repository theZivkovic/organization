import { ConflictException, Inject, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { UserDto, UserRoleDto } from '../dtos/userDto';
import { UserRole } from 'src/infrastructure/models/userModel';
import { RegisterRequestDto } from '../dtos/registerRequestDto';
import { generateSaltAndHash } from 'src/utils/passwordHelper';
import { RegistrationTokenService } from './registration-token.service';
import { userModelToDto } from 'src/converters/userConverter';
import { IUserRepository } from 'src/application/interfaces/userRepository';
import { User } from 'src/core/entities/user';

@Injectable()
export class UsersService {
    constructor(
        @Inject(IUserRepository) private readonly userRepository: IUserRepository, 
        private registrationTokenService: RegistrationTokenService) {

    }

    async validate(email: string, password: string): Promise<boolean> {
        return this.userRepository.validateCredentials(email, password);
    }

    async recreateRegistrationToken(request: { issuingUserId: string, toUserEmail: string, toUserRole: UserRoleDto })
    {
        const toUser = await this.userRepository.getByEmail(request.toUserEmail) 
        ?? await this.userRepository.create({
            email: request.toUserEmail, 
            role: request.toUserRole as unknown as UserRole,
        });

        const registrationToken = await this.registrationTokenService.create({
            issuingUserId: request.issuingUserId,
            toUserId: toUser?.id.toString(),
        });

        return { registrationToken, toUser };
    }

    async register(request: RegisterRequestDto){
        const registrationToken = await this.registrationTokenService.getByToken(request.token);

        const { hash, salt } = await generateSaltAndHash(request.password);
        const updatedUser = await this.userRepository.update(
            registrationToken.toUserId,
            {
                firstName: request.firstName,
                lastName: request.lastName,
                passwordHash: hash,
                passwordSalt: salt
            }
        );

        return updatedUser;
    }
}
