import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export class AdminGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    return (context.switchToHttp().getRequest().currentUser as User)?.isAdmin;
  }
}