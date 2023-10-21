import { Controller, Get, Post } from '@nestjs/common';
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
  //   public async get() {}
  //   public async delete() {}
}
