import { Controller, UseGuards, Get, Request, Post, Body } from '@nestjs/common';
import type { RegisterRequestDto } from '../dtos/registerRequestDto';
import { RoleGuard } from 'src/presentation/guards/auth.guard';
import type { CreateRegistrationTokenRequestDto } from 'src/presentation/dtos/createRegistrationTokenRequestDto';
import { RegistationTokensUseCases } from 'src/application/useCases/registrationTokens.usecases';
import { UsersUseCases } from 'src/application/useCases/users.usecases';
import { UserRole } from 'src/core/enums/userRole';

@Controller('users')
export class UsersController {
  constructor(
    private registrationTokensUseCases: RegistationTokensUseCases,
    private usersUseCases: UsersUseCases) {}

  @UseGuards(RoleGuard([UserRole.EMPLOYEE, UserRole.MANAGER]))
  @Get('me')
  async getMe(@Request() req){
    return this.usersUseCases.getUserById(req.user.userId);
  }

  @Post('register')
  async register(@Body() request: RegisterRequestDto) {
    return this.usersUseCases.register(
      request.token,
      request.firstName,
      request.lastName,
      request.password
    )
  }

  @UseGuards(RoleGuard([UserRole.MANAGER]))
  @Post('registration-tokens')
  async createRegistrationTokens(@Request() req, @Body() request: CreateRegistrationTokenRequestDto){
    return this.registrationTokensUseCases.recreateRegistrationToken(
      req.user.userId,
      request.toUserEmail,
      request.toUserRole
    )
  }

}
