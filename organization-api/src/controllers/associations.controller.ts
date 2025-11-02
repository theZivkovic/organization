import { Controller, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { RoleGuard } from '../guards/auth.guard';
import { UserRoleDto } from 'src/dtos/userDto';
import { AssociationsService } from 'src/services/associations.service';

@Controller('places')
export class AssociationsController {
    constructor(private associationsService: AssociationsService) {}
    
      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Post('/:placeId/users/:userId')
      addUserToAPlace(@Request() req, @Param('placeId') placeId: string, @Param('userId') userId: string) {
        return this.associationsService.addUserToAPlace(req.user.userId, userId, placeId);
      }

      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Delete('/:placeId/users/:userId')
      removeUserFromAPlace(@Request() req, @Param('placeId') placeId: string, @Param('userId') userId: string) {
        return this.associationsService.removeUserToAPlace(req.user.userId, userId, placeId);
      }
}
