import { Controller, Get, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { UserRoleDto } from 'src/dtos/userDto';
import { RoleGuard } from 'src/guards/auth.guard';
import { AssociationsService } from 'src/services/associations.service';
import { PlacesService } from 'src/services/places.service';

@Controller('places')
export class PlacesController {
  constructor(
    private placesService: PlacesService,
    private associationsService: AssociationsService) { }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/')
  async getPlaces(@Request() req) {
    const managingUserAssociation = await this.associationsService.getAssociationForUser(req.user.userId);
    return this.placesService.getPlaceWithDescendants(managingUserAssociation.placeId)
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/:placeId')
  async getPlace(@Request() req, @Param('placeId') placeId: string) {
    const managingUserAssociation = await this.associationsService.getAssociationForUser(req.user.userId);
    return this.placesService.getPlaceAmongDescendants(managingUserAssociation.placeId, placeId);
  }
}
