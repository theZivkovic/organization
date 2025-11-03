import { Controller, UseGuards, Get, Request, Post, Body, Req } from '@nestjs/common';
import { UserRoleDto } from '../../dtos/userDto';
import type { RegisterRequestDto } from '../../dtos/registerRequestDto';
import { RoleGuard } from 'src/presentation/guards/auth.guard';
import type { CreateRegistrationTokenRequestDto } from 'src/dtos/createRegistrationTokenRequestDto';
import { RegistationTokensCases } from 'src/application/useCases/registrationTokens';
import { UsersCases } from 'src/application/useCases/users';

@Controller('users')
export class UsersController {
  constructor(
    private registrationTokensCases: RegistationTokensCases,
    private usersCases: UsersCases) {}

  @UseGuards(RoleGuard([UserRoleDto.EMPLOYEE, UserRoleDto.MANAGER]))
  @Get('me')
  async getMe(@Request() req){
    return req.user;
  }

  @Post('register')
  async register(@Request() req, @Body() request: RegisterRequestDto) {
    return this.usersCases.register(
      request.token,
      request.firstName,
      request.lastName,
      request.password
    )
  }

  @UseGuards(RoleGuard([UserRoleDto.MANAGER]))
  @Post('registration-tokens')
  async createRegistrationTokens(@Request() req, @Body() request: CreateRegistrationTokenRequestDto){
    return this.registrationTokensCases.recreateRegistrationToken(
      req.user.userId,
      request.toUserEmail,
      request.toUserRole
    )
  }

}
