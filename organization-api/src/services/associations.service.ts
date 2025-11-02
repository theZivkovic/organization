import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AssociationRepository } from '../infrastructure/repositories/associationRepository';
import { UsersService } from './users.service';
import { PlacesService } from './places.service';
import { AssociationDto } from 'src/dtos/associationDto';
import { associationModelToDto } from 'src/converters/associationsConverter';
import { placeModelToFullDto } from 'src/converters/placeConverter';

@Injectable()
export class AssociationsService {

    constructor(
        private associationRepository: AssociationRepository,
        private usersService: UsersService,
        private placesService: PlacesService) 
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

    async addUserToAPlace(managerUserId: string, userToAddId: string, placeId: string) {
        const userToAdd = await this.usersService.getUserById(userToAddId);
        const place = await this.placesService.getPlaceById(placeId);

        const userToAddAssociation = await this.getAssociationForUserWithoutThrow(userToAddId);
        
        if (userToAddAssociation && userToAddAssociation.placeId !== placeId){
            throw new ConflictException(`User already works at place: ${userToAddAssociation.placeId}, please unnasign them first`);
        }

        if (userToAddAssociation){
            return placeModelToFullDto(place, [userToAddAssociation], [userToAdd]);
        }

        const managingUserAssociation = await this.getAssociationForUser(managerUserId);

        if (!managingUserAssociation){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        const placesVisibleToManagingUser = await this.placesService.getPlaceWithDescendants(managingUserAssociation.placeId);

        if (!placesVisibleToManagingUser.some(x => x.id === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to add users to this place');
        }

        const createdUserPlace = await this.create(userToAddId, placeId);

        return placeModelToFullDto(place, [createdUserPlace], [userToAdd])
    }

    async removeUserToAPlace(managerUserId: string, userToRemoveId: string, placeId: string){
        
        await this.usersService.getUserById(userToRemoveId);
        await this.placesService.getPlaceById(placeId);
        const userToRemoveAssociation = await this.getAssociationForUser(userToRemoveId);
        
        if (userToRemoveAssociation.placeId !== placeId ){
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUserAssociation = await this.getAssociationForUser(managerUserId);

        const placesVisibleToManagingUser = await this.placesService.getPlaceWithDescendants(managingUserAssociation.placeId);

        if (!placesVisibleToManagingUser.some(x => x.id === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to remove users from this place');
        }

        await this.delete(userToRemoveId, placeId);
    }

}
