import { Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ImUser } from 'decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  public async create(@ImUser('email') email: string) {
    return this.userService.create(email);
  }
  @Get()
  public async get(@ImUser('email') user) {
    return { name: user };
  }
  @Delete()
  public async delete(@ImUser('email') email) {
    return this.userService.delete(email);
  }
  @Get('/count')
  public async getCount(
    @ImUser('email') email,
  ): Promise<{ users: { total: number } }> {
    return this.userService.getCount(email);
  }
}
