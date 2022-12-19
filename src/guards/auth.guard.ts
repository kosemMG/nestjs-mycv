import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    return context.switchToHttp().getRequest().session?.userId;
  }
}