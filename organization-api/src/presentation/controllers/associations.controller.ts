import { Controller, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { RoleGuard } from '../guards/auth.guard';
import { UserRoleDto } from 'src/dtos/userDto';
import { AssociationsUseCases } from 'src/application/useCases/associationsUseCases';

@Controller('places')
export class AssociationsController {
    constructor(
      private associationsCases: AssociationsUseCases
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
