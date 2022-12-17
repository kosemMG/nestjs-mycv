import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
  }

  public async create(email: string, password: string): Promise<User> {
    const user = this.repo.create({ email, password });
    return this.repo.save<User>(user);
  }

  public async findById(id: number): Promise<User> {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  public async findByEmail(email: string): Promise<User[]> {
    return this.repo.findBy({ email });
  }

  public async update(id: number, attributes: Partial<Pick<User, 'email' | 'password'>>): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return this.repo.save({ ...user, ...attributes });
  }

  public async remove(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    return this.repo.remove(user);
  }
}