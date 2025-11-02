import { Controller, Get, UseGuards, Request, Param, Delete, Query } from '@nestjs/common';
import { placeToFullDto } from 'src/converters/placeConverter';
import { UserRoleDto } from 'src/dtos/userDto';
import { RoleGuard } from 'src/guards/auth.guard';
import { AssociationsService } from 'src/services/associations.service';
import { PlacesService } from 'src/services/places.service';
import { UsersService } from 'src/services/users.service';

@Controller('places')
export class PlacesController {
  constructor(
    private placesService: PlacesService,
    private associationsService: AssociationsService,
    private usersService: UsersService) { }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/')
  async getPlaces(@Request() req) {
    const managingUserAssociation = await this.associationsService.getAssociationForUser(req.user.userId);
    const places = await this.placesService.getPlaceWithDescendants(managingUserAssociation.placeId);
    const associations = await this.associationsService.getAssociationsForPlaces(places.map(x => x.id));
    const users = await this.usersService.getUsersByIds(associations.map(x => x.userId));
    return places.map(x => placeToFullDto(x, associations, users));
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/users')
  async getPlacesUsers(@Request() req, @Query('role') roleFilter: UserRoleDto) {
    const managingUserAssociation = await this.associationsService.getAssociationForUser(req.user.userId);
    const places = await this.placesService.getPlaceWithDescendants(managingUserAssociation.placeId);
    const associations = await this.associationsService.getAssociationsForPlaces(places.map(x => x.id));
    const users = await this.usersService.getUsersByIdsWithRole(associations.map(x => x.userId), roleFilter);
    return users;
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/:placeId')
  async getPlace(@Request() req, @Param('placeId') placeId: string) {
    const managingUserAssociation = await this.associationsService.getAssociationForUser(req.user.userId);
    const place = await this.placesService.getPlaceAmongDescendants(managingUserAssociation.placeId, placeId);
    const associations = await this.associationsService.getAssociationsForPlaces([place.id]);
    const users = await this.usersService.getUsersByIds(associations.map(x => x.userId));
    return placeToFullDto(place, associations, users);
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/:placeId/users')
  async getPlaceUsers(@Request() req, @Param('placeId') placeId: string, @Query('role') roleFilter: UserRoleDto) {
    const managingUserAssociation = await this.associationsService.getAssociationForUser(req.user.userId);
    const place = await this.placesService.getPlaceAmongDescendants(managingUserAssociation.placeId, placeId);
    const associations = await this.associationsService.getAssociationsForPlaces([place.id]);
    const users = await this.usersService.getUsersByIdsWithRole(associations.map(x => x.userId), roleFilter);
    return users;
  }


}
