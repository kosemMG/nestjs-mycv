import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findById: (id: number) => Promise.resolve(users.filter(user => user.id === id)[0]),
      findByEmail: (email: string) => Promise.resolve(users.filter(user => user.email === email)),
      remove: (id: number) => Promise.resolve(users.filter(user => user.id === id)[0]),
      update: (id: number) => Promise.resolve(users.filter(user => user.id === id)[0])
    };

    fakeAuthService = {
      signup: (email: string, password: string) => {
        const user: User = { id: Math.floor(Math.random() * 999999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      login: (email: string, password: string) => Promise.resolve(users.filter(user => user.email === email)[0])
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  // Controller is defined
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Signup
  it('signup creates a user with given email & password', async () => {
    const session: { userId?: number } = {};
    await controller.signup({ email: 'test@test.com', password: 'test' }, session);
    const users = await fakeUsersService.findByEmail('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
    expect(session.userId).toEqual(users[0].id);
  });

  // Login
  it('login returns a user with given email & password', async () => {
    const session: { userId?: number } = {};
    await controller.signup({ email: 'test@test.com', password: 'test' }, session);
    const user = await controller.login({ email: 'test@test.com', password: 'test' }, session);
    expect(user.email).toEqual('test@test.com');
    expect(session.userId).toEqual(user.id);
  });

  // Users list by email
  it('findUsersByEmail returns a list of users with a given email', async () => {
    await controller.signup({ email: 'test@test.com', password: 'test' }, {});
    const users = await controller.findUsersByEmail('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  // User not found
  it('findUserById throws an error if user with given id is not found', async () => {
    await expect(controller.findUserById(1)).rejects.toThrow(NotFoundException);
  });
});