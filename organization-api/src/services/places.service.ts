import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlaceRepository } from 'src/infrastructure/repositories/placeRepository';
import { UsersService } from 'src/services/users.service';
import { AssociationsService } from './associations.service';
import { PlaceFullDto } from 'src/dtos/placeFullDto';
import { placeModelToDto, placeModelToFullDto } from 'src/converters/placeConverter';
import { PlaceDto } from 'src/dtos/placeDto';


@Injectable()
export class PlacesService {
    constructor(
        private placeRepository: PlaceRepository) {
    }

    async getPlaceById(placeId: string){
        const place = await this.placeRepository.getById(placeId);

        if (!place) {
            throw new NotFoundException(`Place: ${placeId} not found`);
        }
        const placeDto = placeModelToDto(place);

        return placeDto;
    }

    async getPlaceDescendants(placeLeft: number, placeRight: number) {
        return (await this.placeRepository.getAllDescendants(placeLeft, placeRight))
        .map(x => placeModelToDto(x));
    }

    async getPlaceAmongDescendants(placeId, placeToGetId: string){
        const place = await this.getPlaceById(placeId);

        if (place.id === placeToGetId){
            return place;
        }

        const placeToGet = await this.placeRepository.getPlaceAmongDescendants(place.left, place.right, placeToGetId);

        if (!placeToGet){
            throw new NotFoundException(`Place: ${placeToGetId} not found in given descendants`);
        }

        return placeModelToDto(placeToGet);
        
    }

    async getPlaceWithDescendants(placeId: string){
        const place = await this.getPlaceById(placeId);
        const placeDescendants = await this.getPlaceDescendants(place.left, place.right);
        return [...placeDescendants, place]; 
    }
}
