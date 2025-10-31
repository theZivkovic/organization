import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
    constructor(private placesService: PlacesService) {}
    
      @UseGuards(AuthGuard)
      @Get(':placeId/employees')
      async getMe(@Request() req, @Param('placeId') placeId: string){
        return {
            place: await this.placesService.getById(placeId)
        }
      }
}
