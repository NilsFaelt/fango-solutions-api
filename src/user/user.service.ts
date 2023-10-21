import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      console.log('Welcome');
      return existingUser;
    }

    const createdUser = await this.prismaService.user.create({
      data: {
        email: email,
      },
    });
    return createdUser;
  }
}
