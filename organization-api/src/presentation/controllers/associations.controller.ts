import { Controller, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { RoleGuard } from '../guards/auth.guard';
import { UserRoleDto } from 'src/dtos/userDto';
import { AssociationsService } from 'src/presentation/services/associations.service';
import { associationModelToFullDto } from 'src/converters/associationsConverter';

@Controller('places')
export class AssociationsController {
    constructor(
      private associationsService: AssociationsService,
    ) {}
    
      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Post(':placeId/users/:userId')
      async addUserToAPlace(@Request() req, @Param('placeId') placeToAddToId: string, @Param('userId') userToAddId: string) {
        // const userToAdd = await this.usersService.getUserById(userToAddId);
        // const placesVisibleToManagingUser = await this.placesService.getPlaceWithDescendants(placeToAddToId);
        // await this.associationsService.addUserToAPlace(
        //   req.user.userId,
        //   placesVisibleToManagingUser,
        //   userToAddId, 
        //   placeToAddToId);
        // return associationModelToFullDto(userToAdd, placesVisibleToManagingUser.find(x => x.id === placeToAddToId)!);
        return [];
      }

      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Delete(':placeId/users/:userId')
      async removeUserFromAPlace(@Request() req, @Param('placeId') placeToRemoveFromId: string, @Param('userId') userToRemoveId: string) {
        // const placesVisibleToManagingUser = await this.placesService.getPlaceWithDescendants(placeToRemoveFromId);
        // return this.associationsService.removeUserFromAPlace(
        //   req.user.userId,
        //   placesVisibleToManagingUser,
        //   userToRemoveId,
        //   placeToRemoveFromId);
        return [];
      }
}
