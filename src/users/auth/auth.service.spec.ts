import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';


describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findByEmail: (email: string) => Promise.resolve(users.filter(user => user.email === email)),
      create: (email: string, password: string) => {
        const user: User = { id: Math.floor(Math.random() * 999999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // Service defined
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  // Password
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test');
    expect(user.password).not.toEqual('test');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // Signup with an email in use
  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'test');
    await expect(service.signup('test@test.com', 'test'))
      .rejects.toThrow(BadRequestException);
  });

  // Login with an unused email
  it('throws an exception if login was called with an unused email', async () => {
    await expect(service.login('test@test.com', 'test'))
      .rejects.toThrow(UnauthorizedException);
  });

  // Login with a wrong password
  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'test');
    await expect(service.login('test@test.com', 'test1'))
      .rejects.toThrow(UnauthorizedException);
  });

  // Login with a correct password
  it('returns a user if a correct password is provided', async () => {
    await service.signup('test@test.com', 'test');
    const user = await service.login('test@test.com', 'test');
    expect(user).toBeDefined();
  });
});