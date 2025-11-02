import { Controller, Get, UseGuards, Request, Param, Delete } from '@nestjs/common';
import { UserRoleDto } from 'src/dtos/userDto';
import { RoleGuard } from 'src/guards/auth.guard';
import { PlacesService } from 'src/services/places.service';

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
