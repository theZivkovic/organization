import { Controller, UseGuards, Request, Param, Delete, Post } from '@nestjs/common';
import { RoleGuard } from 'src/auth/auth.guard';
import { PlacesService } from './places.service';
import { UserRoleDto } from 'src/users/dtos/userDto';

@Controller('places')
export class AssociationsController {
    constructor(private placesService: PlacesService) {}
    
      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Post('/:placeId/users/:userId')
      addUserToAPlace(@Request() req, @Param('placeId') placeId: string, @Param('userId') userId: string) {
        return this.placesService.addUserToAPlace(req.user.userId, userId, placeId);
      }

      @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
      @Delete('/:placeId/users/:userId')
      removeUserFromAPlace(@Request() req, @Param('placeId') placeId: string, @Param('userId') userId: string) {
        return this.placesService.removeUserToAPlace(req.user.userId, userId, placeId);
      }
}
