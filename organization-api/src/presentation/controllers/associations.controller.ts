import { Controller, UseGuards, Request, Param, Delete, Post, HttpCode } from '@nestjs/common';
import { RoleGuard } from '../guards/auth.guard';
import { AssociationsUseCases } from 'src/application/useCases/associations.usecases';
import { UserRole } from 'src/core/enums/userRole';

@Controller('places')
export class AssociationsController {
    constructor(
      private associationsCases: AssociationsUseCases
    ) {}
    
      @UseGuards(RoleGuard([UserRole.MANAGER]))
      @Post(':placeId/users/:userId')
      async addUserToAPlace(@Request() req, @Param('placeId') placeToAddToId: string, @Param('userId') userToAddId: string) {
        return this.associationsCases.addUserToAPlace(
          req.user.userId,
          userToAddId,
          placeToAddToId
        );
      }

      @UseGuards(RoleGuard([UserRole.MANAGER]))
      @HttpCode(204)
      @Delete(':placeId/users/:userId')
      async removeUserFromAPlace(@Request() req, @Param('placeId') placeToRemoveFromId: string, @Param('userId') userToRemoveId: string) {
        return this.associationsCases.removeUserFromAPlace(
          req.user.userId,
          userToRemoveId,
          placeToRemoveFromId
        );
      }
}
