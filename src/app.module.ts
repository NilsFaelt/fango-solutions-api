import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { FirebaseService } from './firebase/firebase.service';
import { PreAuthMiddleware } from './auth/middleware/pre-auth.middleware';
import { ClickModule } from './click/click.module';
import { ContentModule } from './content/content.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BookmarkModule,
    PrismaModule,
    UserModule,
    ClickModule,
    ContentModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [FirebaseService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // consumer.apply(PreAuthMiddleware).forRoutes({
    //   path: '*',
    //   method: RequestMethod.ALL,
    // });
  }
}
