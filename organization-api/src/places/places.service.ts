import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { PlaceDto} from './dtos/placeDto';
import { placeModelToDto } from './converters/placeConverter';
import { UserPlaceRepository } from 'src/infrastructure/repositories/userPlaceRepository';

@Injectable()
export class PlacesService {
    constructor(private placeRepository: PlaceRepository, private userPlaceRepository: UserPlaceRepository) {

    }

    async getPlacesForUser(userEmail: string): Promise<Array<PlaceDto>> {
        const foundUserPlaces = await this.userPlaceRepository.getAllForUser(userEmail);

        if (foundUserPlaces.length === 0) {
            throw new NotFoundException();
        }

        const place = await this.placeRepository.getByName(foundUserPlaces[0].placeName);

        if (!place) {
            throw new NotFoundException();
        }

        const placeDescendants = await this.placeRepository.getAllDescendants(place);

        return [...placeDescendants, place].map(x => placeModelToDto(x));

    }
}
