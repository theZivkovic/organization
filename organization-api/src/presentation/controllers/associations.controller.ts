import { Controller, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { RoleGuard } from '../guards/auth.guard';
import { UserRoleDto } from 'src/dtos/userDto';
import { AssociationsCases } from 'src/application/useCases/associations';
import { PlaceCases } from 'src/application/useCases/places';

@Controller('places')
export class AssociationsController {
    constructor(
      private associationsCases: AssociationsCases,
      private placesCases: PlaceCases
    ) {}
    
      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Post(':placeId/users/:userId')
      async addUserToAPlace(@Request() req, @Param('placeId') placeToAddToId: string, @Param('userId') userToAddId: string) {
        return this.associationsCases.addUserToAPlace(
          req.user.userId,
          userToAddId,
          placeToAddToId
        );
      }

      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Delete(':placeId/users/:userId')
      async removeUserFromAPlace(@Request() req, @Param('placeId') placeToRemoveFromId: string, @Param('userId') userToRemoveId: string) {
        return this.associationsCases.removeUserFromAPlace(
          req.user.userId,
          userToRemoveId,
          placeToRemoveFromId
        );
      }
}
