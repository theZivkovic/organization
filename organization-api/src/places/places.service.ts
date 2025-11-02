import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { placeModelToDto, placeModelToFullDto } from './converters/placeConverter';
import { PlaceFullDto } from './dtos/placeFullDto';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { AssociationsService } from 'src/associations/associations.service';
import { PlaceDto } from './dtos/placeDto';

@Injectable()
export class PlacesService {
    constructor(
        private placeRepository: PlaceRepository, 
        private associationService: AssociationsService, 
        private usersService: UsersService) {
    }

    async getPlacesForUser(userId: string): Promise<Array<PlaceFullDto>> {
        const userAssociation = await this.associationService.getAssociationForUser(userId);
        return this.getPlaceWithDescendants(userAssociation.placeId);
    }

    async getPlaceForUser(userId: string, placeToGetId: string): Promise<PlaceFullDto> {

        const user = await this.usersService.getUserById(userId);
        const userAssociation = await this.associationService.getAssociationForUser(user.id);
        const placesVisibleByUser = await this.getPlaceWithDescendants(userAssociation.placeId);

        const placeToGet = placesVisibleByUser.find(x => x.id.toString() === placeToGetId);
        if (!placeToGet) {
            throw new UnauthorizedException(`User ${userId} is not allowed to see the place: ${placeToGetId}`);
        }

        return (await this.getPlacesFull([placeToGet]))[0];
    }

    async addUserToAPlace(managerUserId: string, userToAddId: string, placeId: string) {
        const userToAdd = await this.usersService.getUserById(userToAddId);
        const place = await this.getPlaceById(placeId);

        const userToAddAssociation = await this.associationService.getAssociationForUserWithoutThrow(userToAddId);
        
        if (userToAddAssociation && userToAddAssociation.placeId !== placeId){
            throw new ConflictException(`User already works at place: ${userToAddAssociation.placeId}, please unnasign them first`);
        }

        if (userToAddAssociation){
            return placeModelToFullDto(place, [userToAddAssociation], [userToAdd]);
        }

        const managingUserAssociation = await this.associationService.getAssociationForUser(managerUserId);

        if (!managingUserAssociation){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        const placesVisibleToManagingUser = await this.getPlaceWithDescendants(managingUserAssociation.placeId);

        if (!placesVisibleToManagingUser.some(x => x.id === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to add users to this place');
        }

        const createdUserPlace = await this.associationService.create(userToAddId, placeId);

        return placeModelToFullDto(place, [createdUserPlace], [userToAdd])
    }

    async removeUserToAPlace(managerUserId: string, userToRemoveId: string, placeId: string){
        
        await this.usersService.getUserById(userToRemoveId);
        await this.getPlaceById(placeId);
        const userToRemoveAssociation = await this.associationService.getAssociationForUser(userToRemoveId);
        
        if (userToRemoveAssociation.placeId !== placeId ){
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUserAssociation = await this.associationService.getAssociationForUser(managerUserId);

        const placesVisibleToManagingUser = await this.getPlaceWithDescendants(managingUserAssociation.placeId);

        if (!placesVisibleToManagingUser.some(x => x.id === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to remove users from this place');
        }

        await this.associationService.delete(userToRemoveId, placeId);
    }

    async getPlaceById(placeId: string){
        const place = await this.placeRepository.getById(placeId);

        if (!place) {
            throw new NotFoundException(`Place: ${placeId} not found`);
        }
        const placeDto = placeModelToDto(place);

        return (await this.getPlacesFull([placeDto]))[0];
    }

    async getPlaceDescendants(placeLeft: number, placeRight: number){
        return (await this.placeRepository.getAllDescendants(placeLeft, placeRight))
        .map(x => placeModelToDto(x));
    }

    private async getPlaceWithDescendants(placeId: string){
        const place = await this.getPlaceById(placeId);
        const placeDescendants = await this.getPlaceDescendants(place.left, place.right);
        return this.getPlacesFull([place, ...placeDescendants]);   
    }

    private async getPlacesFull(places: Array<PlaceDto>){
        const associations = await this.associationService.getAssociationsForPlaces(places.map(x => x.id));
        const users = await this.usersService.getUsersByIds(associations.map(x => x.userId));
        return places.map(place => placeModelToFullDto(place, associations, users));   
    }
}
