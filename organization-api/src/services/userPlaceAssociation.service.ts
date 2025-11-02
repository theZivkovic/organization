import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import { PlacesService } from './places.service';
import { AssociationsService } from './associations.service';
import { placeToFullDto } from 'src/converters/placeConverter';
import { PlaceFullDto } from 'src/dtos/placeDto';
import { UserRoleDto } from 'src/dtos/userDto';

@Injectable()
export class UserPlaceAssociationsService {

    constructor(
        private placesService: PlacesService,
        private associationsService: AssociationsService,
        private usersService: UsersService) {
    }

    async getPlacesForUser(userId: string): Promise<Array<PlaceFullDto>> {
        const userAssociation = await this.associationsService.getAssociationForUser(userId);
        const places = await this.placesService.getPlaceWithDescendants(userAssociation.placeId);
        const associations = await this.associationsService.getAssociationsForPlaces(places.map(x => x.id));
        const users = await this.usersService.getUsersByIds(associations.map(x => x.userId));
        return places.map(x => placeToFullDto(x, associations, users));
    }

    async getPlacesUsersForUser(userId: string, roleFilter: UserRoleDto) {
        const userAssociation = await this.associationsService.getAssociationForUser(userId);
        const places = await this.placesService.getPlaceWithDescendants(userAssociation.placeId);
        const associations = await this.associationsService.getAssociationsForPlaces(places.map(x => x.id));
        const users = await this.usersService.getUsersByIdsWithRole(associations.map(x => x.userId), roleFilter);
        return users;
    }

}
