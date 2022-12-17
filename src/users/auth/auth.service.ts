import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {
  }

  public async signup(email: string, password: string): Promise<User> {
    // See if email is in use
    const users = await this.usersService.findByEmail(email);
    if (users?.length) throw new BadRequestException('Email in use');

    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = await scrypt(password, salt, 32) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    return this.usersService.create(email, result);
  }

  public async login(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong credentials');

    const [salt, storedHash] = user.password.split('.');
    const hash = await scrypt(password, salt, 32) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return user;
  }
}