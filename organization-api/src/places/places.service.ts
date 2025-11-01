import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { placeModelToDto, placeModelToFullDto } from './converters/placeConverter';
import { UserPlaceRepository } from 'src/infrastructure/repositories/userPlaceRepository';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { PlaceFullDto } from './dtos/placeFullDto';
import { userModelToDto } from 'src/users/converters/userConverter';

@Injectable()
export class PlacesService {
    constructor(private placeRepository: PlaceRepository, private userPlaceRepository: UserPlaceRepository, private userRepository: UserRepository) {

    }

    async getPlacesForUser(userId: string): Promise<Array<PlaceFullDto>> {
        const usersWorkplace = await this.userPlaceRepository.getForUser(userId);

        if (!usersWorkplace) {
            throw new NotFoundException('User not assigned to a place');
        }

        const placeWhereUserWorks = await this.placeRepository.getById(usersWorkplace.placeId);

        if (!placeWhereUserWorks) {
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(placeWhereUserWorks);

        const allPlaces = [...placeDescendants, placeWhereUserWorks];
        const allUserPlaces = await this.userPlaceRepository.getAllForPlaces(allPlaces.map(x => x._id.toString()));
        const allUsers = await this.userRepository.getAllByIds(allUserPlaces.map(x => x.userId));

        return allPlaces.map(place => placeModelToFullDto(place, allUserPlaces, allUsers));
    }

    async getPlaceForUser(userId: string, placeId: string): Promise<PlaceFullDto> {

        const usersWorkplace = await this.userPlaceRepository.getForUser(userId);

        if (!usersWorkplace) {
            throw new NotFoundException('User not assigned to any place');
        }

        const placeWhereUserWorks = await this.placeRepository.getById(usersWorkplace.placeId);

        if (!placeWhereUserWorks) {
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(placeWhereUserWorks);

        const placeToGet = [placeWhereUserWorks, ...placeDescendants].find(x => x._id.toString() === placeId);
        if (!placeToGet) {
            throw new UnauthorizedException('User is not allowed to see this place');
        }

        const user = await this.userRepository.getById(userId);
        const userPlacesToCheck = await this.userPlaceRepository.get(user!._id.toString(), placeToGet._id.toString());
        
        return placeModelToFullDto(
            placeToGet, 
            userPlacesToCheck ? [userPlacesToCheck]: [], 
            user ? [user]: []
        );
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

        const userToAddWorkplace = await this.userPlaceRepository.getForUser(userToAddId);
        
        if (userToAddWorkplace && userToAddWorkplace.placeId !== placeId){
            throw new ConflictException(`User already works at place: ${userToAddWorkplace.placeId}, please unnasign them first`);
        }

        if (userToAddWorkplace){
            return placeModelToFullDto(place, [userToAddWorkplace], [userToAdd]);
        }

        const managingUsersWorkplace = await this.userPlaceRepository.getForUser(managerUserId);

        if (!managingUsersWorkplace){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        const managingUserPlace = await this.placeRepository.getById(managingUsersWorkplace.placeId);

        if (!managingUserPlace){
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(managingUserPlace);

        const allPlacesUnderManagingUser = [...placeDescendants, managingUserPlace];
        if (!allPlacesUnderManagingUser.some(x => x._id.toString() === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to add users to this place');
        }

        const createdUserPlace = await this.userPlaceRepository.create(userToAddId, placeId);

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

        const userToRemoveWorkplace = await this.userPlaceRepository.getForUser(userToRemoveId);
        
        if (!userToRemoveWorkplace || userToRemoveWorkplace.placeId !== placeId ){
            throw new NotFoundException('User is not assigned to this place');
        }

        const managingUsersWorkplace = await this.userPlaceRepository.getForUser(managerUserId);

        if (!managingUsersWorkplace){
            throw new NotFoundException('Logged in user is not assigned to any place');
        }

        const managingUserPlace = await this.placeRepository.getById(managingUsersWorkplace.placeId);

        if (!managingUserPlace){
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(managingUserPlace);

        const allPlacesUnderManagingUser = [...placeDescendants, managingUserPlace];
        if (!allPlacesUnderManagingUser.some(x => x._id.toString() === placeId)){
            throw new UnauthorizedException('Logged in user is not allowed to remove users from this place');
        }

        await this.userPlaceRepository.delete(userToRemoveId, placeId);
    }
}
