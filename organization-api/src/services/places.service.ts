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

    async getPlaceWithDescendants(placeId: string){
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
