import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IAssociationsRepository } from "src/core/interfaces/associationsRepository";
import { PlaceUseCases } from "./places.usecases";
import { IPlacesRepository } from "src/core/interfaces/placesRepository";

@Injectable()
export class AssociationsUseCases {

    constructor(
        @Inject(IAssociationsRepository) private readonly associationsRepository: IAssociationsRepository,
    @Inject(IPlacesRepository) private readonly placesRepository: IPlacesRepository) {
    }

    async addUserToAPlace(managerUserId: string, userToAddId: string, placeToAddToId: string) {

        const userToAddAssociation = await this.associationsRepository.getForUser(userToAddId);

        if (userToAddAssociation && userToAddAssociation.placeId !== placeToAddToId) {
            throw new ConflictException(`User already works at place: ${userToAddAssociation.placeId}, please unnasign them first`);
        }

        if (userToAddAssociation) {
            return userToAddAssociation;
        }

        const managingUserAssociation = await this.associationsRepository.getForUser(managerUserId);

        if (!managingUserAssociation) {
            throw new NotFoundException('Managing user is not assigned to any place');
        }

        const managingUserPlace = await this.placesRepository.getById(managingUserAssociation.placeId);
        
        if (!managingUserPlace){
            throw new NotFoundException(`Place: ${managingUserAssociation.placeId} not found`)
        }

        const managingUserPlaceDescendants = await this.placesRepository.getAllDescendants(managingUserPlace.left, managingUserPlace.right);
        const placesVisibleToManagingUser = [...managingUserPlaceDescendants, managingUserPlace];

        if (!placesVisibleToManagingUser.some(x => x.id === placeToAddToId)) {
            throw new UnauthorizedException('Managing user is not allowed to add users to this place');
        }

        return this.associationsRepository.create(userToAddId, placeToAddToId);
    }

    async removeUserFromAPlace(managerUserId: string, userToRemoveId: string, placeToRemoveFromId: string) {
        
        const userToRemoveAssociation = await this.associationsRepository.getForUser(userToRemoveId);

        if (!userToRemoveAssociation || userToRemoveAssociation.placeId !== placeToRemoveFromId) {
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUserAssociation = await this.associationsRepository.getForUser(managerUserId);

        if (!managingUserAssociation) {
            throw new NotFoundException('Managing user is not assigned to any place');
        }

        const managingUserPlace = await this.placesRepository.getById(managingUserAssociation.placeId);
        
        if (!managingUserPlace){
            throw new NotFoundException(`Place: ${managingUserAssociation.placeId} not found`)
        }

        const managingUserPlaceDescendants = await this.placesRepository.getAllDescendants(managingUserPlace.left, managingUserPlace.right);
        const placesVisibleToManagingUser = [...managingUserPlaceDescendants, managingUserPlace];

        if (!placesVisibleToManagingUser.some(x => x.id === placeToRemoveFromId)) {
            throw new UnauthorizedException('Managing user is not allowed to remove users from this place');
        }

        await this.associationsRepository.delete(userToRemoveId, placeToRemoveFromId);
    }
}

