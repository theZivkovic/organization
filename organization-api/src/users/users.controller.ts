import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { RoleGuard } from '../auth/auth.guard';
import { UserRoleDto } from './dtos/userDto';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('me')
  async getMe(@Request() req){
    return req.user;
  }

}
