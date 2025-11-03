import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IAssociationsRepository } from "../../core/interfaces/associationsRepository";
import { IPlacesRepository } from "../../core/interfaces/placesRepository";
import { IUsersRepository } from "../../core/interfaces/usersRepository";

@Injectable()
export class AssociationsUseCases {

    constructor(
        @Inject(IAssociationsRepository) private readonly associationsRepository: IAssociationsRepository,
        @Inject(IPlacesRepository) private readonly placesRepository: IPlacesRepository,
        @Inject(IUsersRepository) private readonly usersRepository: IUsersRepository) {
    }

    async addUserToAPlace(managerUserId: string, userToAddId: string, placeToAddToId: string) {

        if (!await this.usersRepository.getById(userToAddId)){
            throw new NotFoundException(`User to add: ${userToAddId} not found`);
        }

        const userToAddAssociation = await this.associationsRepository.getForUser(userToAddId);

        if (userToAddAssociation && userToAddAssociation.placeId !== placeToAddToId) {
            throw new ConflictException(`User already works at place: ${userToAddAssociation.placeId}, please unnasign them first`);
        }

        if (userToAddAssociation) {
            return userToAddAssociation;
        }

        if (!await this.usersRepository.getById(managerUserId)){
            throw new NotFoundException(`Managing user: ${managerUserId} not found`);
        }

        const managingUserAssociation = await this.associationsRepository.getForUser(managerUserId);

        if (!managingUserAssociation) {
            throw new NotFoundException(`Managing user: ${managerUserId} is not assigned to any place`);
        }

        const managingUserPlace = await this.placesRepository.getById(managingUserAssociation.placeId);

        if (!managingUserPlace) {
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

        if (!await this.usersRepository.getById(userToRemoveId)){
            throw new NotFoundException(`User to remove: ${userToRemoveId} not found`);
        }

        const userToRemoveAssociation = await this.associationsRepository.getForUser(userToRemoveId);

        if (!userToRemoveAssociation || userToRemoveAssociation.placeId !== placeToRemoveFromId) {
            throw new NotFoundException('User is not assigned to this place');
        }

        if (!await this.usersRepository.getById(managerUserId)){
            throw new NotFoundException(`Managing user: ${managerUserId} not found`);
        }

        const managingUserAssociation = await this.associationsRepository.getForUser(managerUserId);

        if (!managingUserAssociation) {
            throw new NotFoundException(`Managing user: ${managerUserId} is not assigned to any place`);
        }

        const managingUserPlace = await this.placesRepository.getById(managingUserAssociation.placeId);

        if (!managingUserPlace) {
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

