import { Controller, UseGuards, Get, Request, Post, Body } from '@nestjs/common';
import { RoleGuard } from '../auth/auth.guard';
import { UserRoleDto } from './dtos/userDto';
import { UsersService } from './users.service';
import type { RegisterRequestDto } from './dtos/registerRequestDto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('me')
  async getMe(@Request() req){
    return req.user;
  }

  @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
  @Post('registration-tokens')
  async recreateRegistrationToken(@Request() req, @Body() request: { toUserEmail: string, toUserRole: UserRoleDto }) {
    return this.userService.recreateRegistrationToken({issuingUserId: req.user.userId, toUserEmail: request.toUserEmail, toUserRole: request.toUserRole})
  }

  @Post('register')
  async register(@Request() req, @Body() request: RegisterRequestDto) {
    return this.userService.register(request)
  }

}
