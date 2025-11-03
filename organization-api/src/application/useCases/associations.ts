import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IUserRepository } from "../../core/interfaces/userRepository";
import { IRegistrationTokenRepository } from "../../core/interfaces/registrationgTokenRepository";
import { IAssociationRepository } from "src/core/interfaces/associationRepository";
import { Place } from "src/core/entities/place";
import { PlaceCases } from "./places";

@Injectable()
export class AssociationsCases {

    constructor(
        @Inject(IAssociationRepository) private readonly associationsRepository: IAssociationRepository,
        private placesCases: PlaceCases) {
    }

    async addUserToAPlace(managerUserId: string, userToAddId: string, placeToAddToId: string) {

        const placesVisibleToManagingUser = await this.placesCases.getPlacesVisibleByUser(managerUserId);

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

        if (!placesVisibleToManagingUser.some(x => x.id === placeToAddToId)) {
            throw new UnauthorizedException('Managing user is not allowed to add users to this place');
        }

        return this.associationsRepository.create(userToAddId, placeToAddToId);
    }

    async removeUserFromAPlace(managerUserId: string, userToRemoveId: string, placeToRemoveFromId: string) {
        
        const placesVisibleToManagingUser = await this.placesCases.getPlacesVisibleByUser(managerUserId);

        const userToRemoveAssociation = await this.associationsRepository.getForUser(userToRemoveId);

        if (!userToRemoveAssociation || userToRemoveAssociation.placeId !== placeToRemoveFromId) {
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUserAssociation = await this.associationsRepository.getForUser(managerUserId);

        if (!managingUserAssociation) {
            throw new NotFoundException('Managing user is not assigned to any place');
        }

        if (!placesVisibleToManagingUser.some(x => x.id === placeToRemoveFromId)) {
            throw new UnauthorizedException('Managing user is not allowed to remove users from this place');
        }

        await this.associationsRepository.delete(userToRemoveId, placeToRemoveFromId);
    }
}

