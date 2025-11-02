import { Controller, UseGuards, Get, Request, Post, Body } from '@nestjs/common';
import { UserRoleDto } from '../../dtos/userDto';
import { UsersService } from '../../services/users.service';
import type { RegisterRequestDto } from '../../dtos/registerRequestDto';
import { RoleGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('me')
  async getMe(@Request() req){
    return req.user;
  }

  @Post('register')
  async register(@Request() req, @Body() request: RegisterRequestDto) {
    return this.userService.register(request)
  }

}
