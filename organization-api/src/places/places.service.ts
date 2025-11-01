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

        const foundUserPlaces = await this.userPlaceRepository.getAllForUser(userId);

        if (foundUserPlaces.length === 0) {
            throw new NotFoundException('User not assigned to any place');
        }

        const place = await this.placeRepository.getById(foundUserPlaces[0].placeId);

        if (!place) {
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place);

        const placeToCheck = [place, ...placeDescendants].find(x => x._id.toString() === placeId);
        if (!placeToCheck){
            throw new UnauthorizedException('user is not allowed to see this place');
        }

        const user = await this.userRepository.getById(userId);
        const userPlacesToCheck = await this.userPlaceRepository.get(user!._id.toString(), placeToCheck._id.toString());
        
        return placeModelToFullDto(place, userPlacesToCheck ? [userPlacesToCheck]: [], user ? [user]: []);
    }
}
