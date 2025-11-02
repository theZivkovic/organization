import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { placeModelToFullDto } from './converters/placeConverter';
import { AssociationRepository } from 'src/infrastructure/repositories/associationRepository';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { PlaceFullDto } from './dtos/placeFullDto';
import { Place } from 'src/infrastructure/models/placeModel';

@Injectable()
export class PlacesService {
    constructor(
        private placeRepository: PlaceRepository, 
        private associationRepository: AssociationRepository, 
        private userRepository: UserRepository) {
    }

    async getPlacesForUser(userId: string): Promise<Array<PlaceFullDto>> {
        const userAssociation = await this.associationRepository.getForUser(userId);

        if (!userAssociation) {
            throw new NotFoundException(`User: ${userId} not associated to any place`);
        }

        const placesVisibleByUser = await this.getPlaceWithDescendants(userAssociation.placeId);
        return this.getPlacesFull(placesVisibleByUser);
    }

    async getPlaceForUser(userId: string, placeId: string): Promise<PlaceFullDto> {

        const user = await this.userRepository.getById(userId);

        if (!user) {
            throw new NotFoundException(`User: ${userId} not found`);
        }

        const userWorkplace = await this.associationRepository.getForUser(userId);

        if (!userWorkplace) {
            throw new NotFoundException(`User: ${user.email} not assigned to a work place`);
        }

        const placesVisibleByUser = await this.getPlaceWithDescendants(userWorkplace.placeId);

        const placeToGet = placesVisibleByUser.find(x => x._id.toString() === placeId);
        if (!placeToGet) {
            throw new UnauthorizedException(`User ${userId} is not allowed to see the place: ${placeId}`);
        }

        return (await this.getPlacesFull([placeToGet]))[0];
    }

    async addUserToAPlace(managerUserId: string, userToAddId: string, placeId: string){
        
        const userToAdd = await this.userRepository.getById(userToAddId);

        if (!userToAdd){
            throw new NotFoundException('User-to-add not found');
        }

        const place = await this.placeRepository.getById(placeId);

        if (!place){
            throw new NotFoundException('Place not found');
        }

        const userToAddAssociation = await this.associationRepository.getForUser(userToAddId);
        
        if (userToAddAssociation && userToAddAssociation.placeId !== placeId){
            throw new ConflictException(`User already works at place: ${userToAddAssociation.placeId}, please unnasign them first`);
        }

        if (userToAddAssociation){
            return placeModelToFullDto(place, [userToAddAssociation], [userToAdd]);
        }

        const managingUsersWorkplace = await this.associationRepository.getForUser(managerUserId);

        if (!managingUsersWorkplace){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        const placesVisibleToManagingUser = await this.getPlaceWithDescendants(managingUsersWorkplace.placeId);

        if (!placesVisibleToManagingUser.some(x => x._id.toString() === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to add users to this place');
        }

        const createdUserPlace = await this.associationRepository.create(userToAddId, placeId);

        return placeModelToFullDto(place, [createdUserPlace], [userToAdd])
    }

    async removeUserToAPlace(managerUserId: string, userToRemoveId: string, placeId: string){
        
        const userToRemove = await this.userRepository.getById(userToRemoveId);

        if (!userToRemove){
            throw new NotFoundException('User-to-remove not found');
        }

        const place = await this.placeRepository.getById(placeId);

        if (!place){
            throw new NotFoundException('Place not found');
        }

        const userToRemoveAssociation = await this.associationRepository.getForUser(userToRemoveId);
        
        if (!userToRemoveAssociation || userToRemoveAssociation.placeId !== placeId ){
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUserAssociation = await this.associationRepository.getForUser(managerUserId);

        if (!managingUserAssociation){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        const placesVisibleToManagingUser = await this.getPlaceWithDescendants(managingUserAssociation.placeId);

        if (!placesVisibleToManagingUser.some(x => x._id.toString() === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to remove users from this place');
        }

        await this.associationRepository.delete(userToRemoveId, placeId);
    }

    private async getPlaceWithDescendants(placeId: string){
        const place = await this.placeRepository.getById(placeId);

        if (!place) {
            throw new NotFoundException(`Place: ${placeId} not found`);
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place);
        return [place, ...placeDescendants];
    }

    private async getPlacesFull(places: Array<Place>){
        const associations = await this.associationRepository.getAllForPlaces(places.map(x => x._id.toString()));
        const users = await this.userRepository.getAllByIds(associations.map(x => x.userId));
        return places.map(place => placeModelToFullDto(place, associations, users));   
    }
}
