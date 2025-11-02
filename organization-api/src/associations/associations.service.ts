import { Injectable, NotFoundException } from '@nestjs/common';
import { AssociationRepository } from 'src/infrastructure/repositories/associationRepository';
import { associationModelToDto } from './converters/associationsConverter';
import { AssociationDto } from './dtos/associationDto';

@Injectable()
export class AssociationsService {

    constructor(
        private associationRepository: AssociationRepository) 
    {
    }

    async getAssociation(userId: string, placeId: string){
        const association = await this.associationRepository.get(userId, placeId);

        if (!association){
            throw new NotFoundException(`Association for user: ${userId} and place: ${placeId} not found`);
        }

        return association;
    }

    async getAssociationForUser(userId: string){
        const association = await this.associationRepository.getForUser(userId);

        if (!association){
            throw new NotFoundException(`Association for user: ${userId} not found`);
        }

        return association;
    }

    async getAssociationForUserWithoutThrow(userId: string): Promise<AssociationDto | null>{
        const association = await this.associationRepository.getForUser(userId);

        return association 
            ? associationModelToDto(association)
            : null;
    }

    async getAssociationsForPlaces(placesIds: Array<string>){
        return (await this.associationRepository.getAllForPlaces(placesIds))
        .map(x => associationModelToDto(x));
    }

    async create(userId: string, placeId: string): Promise<AssociationDto> {
        const createdAssociation = await this.associationRepository.create(userId, placeId);
        return associationModelToDto(createdAssociation);
    }

    async delete(userId: string, placeId: string) {
        await this.associationRepository.delete(userId, placeId);
    }

}
