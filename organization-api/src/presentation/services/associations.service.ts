import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AssociationRepository } from '../../infrastructure/repositories/associationRepository';
import { AssociationDto } from 'src/dtos/associationDto';
import { associationModelToDto } from 'src/converters/associationsConverter';
import { PlaceDto } from 'src/dtos/placeDto';

@Injectable()
export class AssociationsService {

    constructor(private associationRepository: AssociationRepository) {
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

    async createAssociation(userId: string, placeId: string): Promise<AssociationDto> {
        const createdAssociation = await this.associationRepository.create(userId, placeId);
        return associationModelToDto(createdAssociation);
    }

    async deleteAssociation(userId: string, placeId: string) {
        await this.associationRepository.delete(userId, placeId);
    }

    async addUserToAPlace(managerUserId: string, placesVisibleToManagingUser: Array<PlaceDto>, userToAddId: string, placeToAddToId: string) {
        
        const userToAddAssociation = await this.getAssociationForUserWithoutThrow(userToAddId);
        
        if (userToAddAssociation && userToAddAssociation.placeId !== placeToAddToId){
            throw new ConflictException(`User already works at place: ${userToAddAssociation.placeId}, please unnasign them first`);
        }

        if (userToAddAssociation){
            return userToAddAssociation;
        }

        const managingUserAssociation = await this.getAssociationForUser(managerUserId);

        if (!managingUserAssociation){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        if (!placesVisibleToManagingUser.some(x => x.id === placeToAddToId)){
            throw new UnauthorizedException('Logged in user is not allowed to add users to this place');
        }

        const createdUserPlace = await this.createAssociation(userToAddId, placeToAddToId);
        return associationModelToDto(createdUserPlace);
    }

    async removeUserFromAPlace(managerUserId: string, placesVisibleToManagingUser: Array<PlaceDto>, userToRemoveId: string, placeToRemoveFromId: string) {
        const userToRemoveAssociation = await this.getAssociationForUser(userToRemoveId);
        if (userToRemoveAssociation.placeId !== placeToRemoveFromId ){
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUserAssociation = await this.getAssociationForUser(managerUserId);

        if (!managingUserAssociation){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        if (!placesVisibleToManagingUser.some(x => x.id === placeToRemoveFromId)){
            throw new UnauthorizedException('Logged in user is not allowed to remove users from this place');
        }

        await this.deleteAssociation(userToRemoveId, placeToRemoveFromId);
    }

}
