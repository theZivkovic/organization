import { Controller, Get, UseGuards, Request, Param, Query } from '@nestjs/common';
import { PlaceUseCases } from 'src/application/useCases/places.usecases';
import { UserRole } from 'src/core/enums/userRole';
import { RoleGuard } from 'src/presentation/guards/auth.guard';

@Controller('places')
export class PlacesController {
  constructor(private placeCases: PlaceUseCases ) { }

  @UseGuards(RoleGuard([UserRole.EMPLOYEE, UserRole.MANAGER]))
  @Get('/')
  async getPlaces(@Request() req) {
    return this.placeCases.getPlacesVisibleByUser(req.user.userId);
  }

  @UseGuards(RoleGuard([UserRole.EMPLOYEE, UserRole.MANAGER]))
  @Get('/users')
  async getPlacesUsers(@Request() req, @Query('role') roleFilter: UserRole) {
    return this.placeCases.getPlacesUsersVisibleByUser(req.user.userId, roleFilter);
  }

  @UseGuards(RoleGuard([UserRole.EMPLOYEE, UserRole.MANAGER]))
  @Get('/:placeId')
  async getPlace(@Request() req, @Param('placeId') placeId: string) {
    return this.placeCases.getPlaceVisibleByUser(req.user.userId, placeId);
  }

  @UseGuards(RoleGuard([UserRole.EMPLOYEE, UserRole.MANAGER]))
  @Get('/:placeId/users')
  async getPlaceUsers(@Request() req, @Param('placeId') placeId: string, @Query('role') roleFilter: UserRole) {
    return this.placeCases.getPlaceUsersVisibleByUser(req.user.userId, placeId, roleFilter);
  }
}
