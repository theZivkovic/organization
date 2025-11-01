import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { PlaceDto} from './dtos/placeDto';
import { placeModelToDto } from './converters/placeConverter';
import { UserPlaceRepository } from 'src/infrastructure/repositories/userPlaceRepository';

@Injectable()
export class PlacesService {
    constructor(private placeRepository: PlaceRepository, private userPlaceRepository: UserPlaceRepository) {

    }

    async getPlacesForUser(userId: string): Promise<Array<PlaceDto>> {
        
        const foundUserPlaces = await this.userPlaceRepository.getAllForUser(userId);

        if (foundUserPlaces.length === 0) {
            throw new NotFoundException('User not assigned to a place');
        }

        const place = await this.placeRepository.getById(foundUserPlaces[0].placeId);

        if (!place) {
            throw new NotFoundException('Place not found');
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place);

        return [...placeDescendants, place].map(x => placeModelToDto(x));

    }
}
