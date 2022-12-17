import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    return context.switchToHttp().getRequest().request.session.userId;
  }

}