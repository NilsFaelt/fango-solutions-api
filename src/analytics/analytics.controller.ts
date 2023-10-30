import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ImUser } from 'decorator';
import { AnalyticsInterface } from './types/types';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}
  @Get()
  public async get(
    @ImUser('email') email: string,
  ): Promise<AnalyticsInterface> {
    return this.analyticsService.get(email);
  }
}
