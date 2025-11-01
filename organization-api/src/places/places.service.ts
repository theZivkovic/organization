import { Injectable, NotFoundException } from '@nestjs/common';
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
        const foundUserPlaces = await this.userPlaceRepository.getAllForUser(userId);

        if (foundUserPlaces.length === 0) {
            throw new NotFoundException('User not assigned to a place');
        }

        const place = await this.placeRepository.getById(foundUserPlaces[0].placeId);

        if (!place) {
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place);

        const allPlaces = [...placeDescendants, place];
        const allUserPlaces = await this.userPlaceRepository.getAllForPlaces(allPlaces.map(x => x._id.toString()));
        const allUsers = await this.userRepository.getAllByIds(allUserPlaces.map(x => x.userId));
        
        return [...placeDescendants, place].map(place => placeModelToFullDto(place, allUserPlaces, allUsers));
    }

    async getPlaceForUser(userId: string, placeId: string): Promise<PlaceFullDto> {
        const foundUserPlace = await this.userPlaceRepository.get(userId, placeId);

        if (!foundUserPlace){
            throw new NotFoundException('user and place connection not found');
        }

        const user = await this.userRepository.getById(foundUserPlace.userId);

        if (!user){
            throw new NotFoundException('user not found');
        }

        const place = await this.placeRepository.getById(userId);

        if (!place) {
            throw new NotFoundException('Place not found');
        }
        
        return placeModelToFullDto(place, [foundUserPlace], [user]);
    }
}
