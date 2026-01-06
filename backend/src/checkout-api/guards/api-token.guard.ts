import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Bearer token is required');
    }

    const validToken = this.configService.get('NEXTAUTH_SECRET');

    if (!validToken) {
      throw new Error('NEXTAUTH_SECRET is not configured');
    }

    if (token !== validToken) {
      throw new UnauthorizedException('Invalid API token');
    }

    return true;
  }
}
