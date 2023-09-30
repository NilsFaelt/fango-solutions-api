import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  public async create() {
    const user = await this.prismaService.user.create({
      data: {
        email: 'nilsgmail.com',
        userName: 'nils faelt',
      },
    });
    return user;
  }
  //   public async get() {}
  //   public async delete() {}
}
