import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {
  }

  public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.session || {};
    if (userId) {
      req.currentUser = await this.usersService.findById(userId);
    }
    next();
  }
}