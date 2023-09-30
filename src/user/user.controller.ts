import { Controller, Injectable, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  public async create() {
    return this.userService.create();
  }
  //   public async get() {}
  //   public async delete() {}
}
