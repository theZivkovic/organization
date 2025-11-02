import { Controller, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { RoleGuard } from '../guards/auth.guard';
import { UserRoleDto } from 'src/dtos/userDto';
import { AssociationsService } from 'src/services/associations.service';
import { PlacesService } from 'src/services/places.service';

@Controller('places')
export class AssociationsController {
    constructor(
      private associationsService: AssociationsService,
      private placesService: PlacesService
    ) {}
    
      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Post(':placeId/users/:userId')
      async addUserToAPlace(@Request() req, @Param('placeId') placeId: string, @Param('userId') userId: string) {
        const placesVisibleToManagingUser = await this.placesService.getPlaceWithDescendants(placeId);
        return this.associationsService.addUserToAPlace(
          req.user.userId,
          placesVisibleToManagingUser,
          userId, 
          placeId);
      }

      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Delete(':placeId/users/:userId')
      async removeUserFromAPlace(@Request() req, @Param('placeId') placeId: string, @Param('userId') userId: string) {
        const placesVisibleToManagingUser = await this.placesService.getPlaceWithDescendants(placeId);
        return this.associationsService.removeUserFromAPlace(
          req.user.userId,
          placesVisibleToManagingUser,
          userId,
          placeId);
      }
}
