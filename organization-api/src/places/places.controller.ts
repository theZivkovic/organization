import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
    constructor(private placesService: PlacesService) {}
    
      @UseGuards(AuthGuard)
      @Get('/')
      async getPlaces(@Request() req) {
        return {
            place: await this.placesService.getPlacesForUser(req.user.email)
        }
      }
}
