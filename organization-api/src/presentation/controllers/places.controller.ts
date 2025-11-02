import { Controller, Get, UseGuards, Request, Param, Query } from '@nestjs/common';
import { PlaceCases } from 'src/application/useCases/places';
import { UserRole } from 'src/core/enums/userRole';
import { UserRoleDto } from 'src/dtos/userDto';
import { RoleGuard } from 'src/guards/auth.guard';

@Controller('places')
export class PlacesController {
  constructor(private placeCases: PlaceCases ) { }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/')
  async getPlaces(@Request() req) {
    return this.placeCases.getPlacesVisibleByUser(req.user.userId);
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/users')
  async getPlacesUsers(@Request() req, @Query('role') roleFilter: UserRole) {
    return this.placeCases.getPlacesUsersVisibleByUser(req.user.userId, roleFilter);
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/:placeId')
  async getPlace(@Request() req, @Param('placeId') placeId: string) {
    return this.placeCases.getPlaceVisibleByUser(req.user.userId, placeId);
  }

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('/:placeId/users')
  async getPlaceUsers(@Request() req, @Param('placeId') placeId: string, @Query('role') roleFilter: UserRole) {
    return this.placeCases.getPlaceUsersVisibleByUser(req.user.userId, placeId, roleFilter);
  }
}
