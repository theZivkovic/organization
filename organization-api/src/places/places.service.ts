import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { placeModelToDto, placeModelToFullDto } from './converters/placeConverter';
import { UserPlaceRepository } from 'src/infrastructure/repositories/userPlaceRepository';
import { UserRepository } from 'src/infrastructure/repositories/userRepository';
import { PlaceFullDto } from './dtos/placeFullDto';

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

        const placeToCheck = [placeWhereUserWorks, ...placeDescendants].find(x => x._id.toString() === placeId);
        if (!placeToCheck){
            throw new UnauthorizedException('user is not allowed to see this place');
        }

        const user = await this.userRepository.getById(userId);
        const userPlacesToCheck = await this.userPlaceRepository.get(user!._id.toString(), placeToCheck._id.toString());
        
        return placeModelToFullDto(
            placeToCheck, 
            userPlacesToCheck ? [userPlacesToCheck]: [], 
            user ? [user]: []
        );
    }
}
