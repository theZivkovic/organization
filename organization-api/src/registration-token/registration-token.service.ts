import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistrationTokenRequestDto } from './dtos/CreateRegistrationTokenRequestDto';
import { RegistrationTokenDto } from './dtos/RegistrationTokenDto';
import { RegistrationTokenRepository } from 'src/infrastructure/repositories/registrationCodeRepository';
import { v4 as uuidv4 } from 'uuid';
import { registrationTokenModelToDto } from './converters/registrationTokenConverter';

@Injectable()
export class RegistrationTokenService {

    constructor(private registrationTokenRepository: RegistrationTokenRepository){

    }

    async getByToken(token: string): Promise<RegistrationTokenDto>{
        const registrationToken = await this.registrationTokenRepository.getByToken(token);

        if (!registrationToken){
            throw new NotFoundException('registrationToken not found');
        }

        return registrationTokenModelToDto(registrationToken);
    }

    async create(request: CreateRegistrationTokenRequestDto): Promise<RegistrationTokenDto> {
        const existingToken = await this.registrationTokenRepository.getForUser(request.toUserId);

        if (existingToken)
        {
            await this.registrationTokenRepository.delete(existingToken._id.toString());
        }

        const newToken = uuidv4();
        const createdRegToken = await this.registrationTokenRepository.create({...request, token: newToken}); 
        return registrationTokenModelToDto(createdRegToken);
    }
}
