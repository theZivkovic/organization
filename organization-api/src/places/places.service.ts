import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { PlaceDto} from './dtos/placeDto';
import { placeModelToDto } from './converters/placeConverter';

@Injectable()
export class PlacesService {
    constructor(private placeRepository: PlaceRepository) {

    }

    async getById(id: string): Promise<PlaceDto> {
        const foundPlace = await this.placeRepository.getById(id);

        if (!foundPlace) {
            throw new NotFoundException();
        }

        return placeModelToDto(foundPlace);
    }
}
