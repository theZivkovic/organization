import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req){
    return req.user;
  }

}
