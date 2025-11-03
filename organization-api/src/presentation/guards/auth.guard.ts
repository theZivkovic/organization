import { CanActivate, ExecutionContext, Injectable, mixin, Type, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/core/enums/userRole';

export const RoleGuard = (allowedRoles: Array<UserRole>): Type<CanActivate> => {
    @Injectable()
    class AuthGuardMixin implements CanActivate {
        constructor(private jwtService: JwtService, private configService: ConfigService) { }

        async canActivate(
            context: ExecutionContext,
        ): Promise<boolean> {
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException('Missing authorization token');
            }
            try {
                const payload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: this.configService.get<string>('JWT_SECRET')
                    }
                );
                if (!allowedRoles.some(x => x === payload.userRole)) {
                    throw new UnauthorizedException('Inadequate role')
                }

                request['user'] = payload;
            } catch {
                throw new UnauthorizedException();
            }
            return true;
        }
        
        private extractTokenFromHeader(request: Request): string | undefined {
            const [type, token] = request.headers['authorization']?.split(' ') ?? [];
            return type === 'Bearer' ? token : undefined;
        }
    }
    return mixin(AuthGuardMixin);
}
