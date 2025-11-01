import { Controller, Get, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { RoleGuard } from 'src/auth/auth.guard';
import { PlacesService } from './places.service';
import { UserRoleDto } from 'src/users/dtos/userDto';

@Controller('places')
export class PlacesController {
    constructor(private placesService: PlacesService) {}
    
      @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
      @Get('/')
      getPlaces(@Request() req) {
        return this.placesService.getPlacesForUser(req.user.userId)
      }

      @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
      @Get('/:placeId')
      getPlace(@Request() req, @Param('placeId') placeId: string) {
        return this.placesService.getPlaceForUser(req.user.userId, placeId);
      }
}
