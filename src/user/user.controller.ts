import { Controller, Get, Injectable, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ImUser } from 'decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  public async create() {
    return this.userService.create();
  }
  @Get()
  public async get(@ImUser('email') user) {
    console.log(user, ' hallå');
    return { name: user };
  }
  //   public async get() {}
  //   public async delete() {}
}
