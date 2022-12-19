import {
  Body, Controller,
  Delete,
  Get, HttpCode, HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, Session, UseGuards, UseInterceptors, UsePipes
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Serialise } from '../interceptors/serialise.interceptor';
import { AuthService } from './auth/auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Serialise(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService,
              private readonly authService: AuthService) {
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  public async whoAmI(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Post('signup')
  public async signup(@Body() request: AuthUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.signup(request.email, request.password);
    session.userId = user.id;
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() request: AuthUserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.login(request.email, request.password);
    session.userId = user.id;
    console.log('session', session)
    return user;
  }

  @Post('logout')
  public logout(@Session() session: any): void {
    session.userId = null;
  }

  @Get(':id')
  @UsePipes(new ParseIntPipe())
  public async findUserById(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  public async findUsersByEmail(@Query('email') email: string): Promise<User[]> {
    return this.usersService.findByEmail(email);
  }

  @Delete(':id')
  @UsePipes(new ParseIntPipe())
  public async removeUser(@Param('id') id: number): Promise<User> {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  public async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, body);
  }
}