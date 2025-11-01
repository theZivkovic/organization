import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { RoleGuard } from 'src/auth/auth.guard';
import { PlacesService } from './places.service';
import { UserRoleDto } from 'src/users/dtos/userDto';

@Controller('places')
export class PlacesController {
    constructor(private placesService: PlacesService) {}
    
      @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
      @Get('/')
      async getPlaces(@Request() req) {
        return {
            place: await this.placesService.getPlacesForUser(req.user.userId)
        }
      }
}
