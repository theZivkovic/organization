import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { UserDto, UserRoleDto } from '../dtos/userDto';
import { UserRole } from 'src/infrastructure/models/userModel';
import { RegisterRequestDto } from '../dtos/registerRequestDto';
import { generateSaltAndHash } from 'src/utils/passwordHelper';
import { RegistrationTokenService } from './registration-token.service';
import { userModelToDto } from 'src/converters/userConverter';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository, private registrationTokenService: RegistrationTokenService) {

    }

    async getUserByEmail(email: string): Promise<UserDto> {
        const foundUser = await this.userRepository.getByEmail(email);

        if (!foundUser){
            throw new NotFoundException(`User: ${email} not found`);
        }

        return userModelToDto(foundUser);
    }

    async getUserById(id: string): Promise<UserDto> {
        const foundUser = await this.userRepository.getById(id);

        if (!foundUser){
            throw new NotFoundException(`User: ${id} not found`);
        }

        return userModelToDto(foundUser);
    }

    async getUsersByIds(ids: Array<string>): Promise<Array<UserDto>> {
        return (await this.userRepository.getAllByIds(ids))
        .map(x => userModelToDto(x));
    }

    async validate(email: string, password: string): Promise<boolean> {
        return this.userRepository.validate(email, password);
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
            toUserId: toUser?._id.toString(),
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
