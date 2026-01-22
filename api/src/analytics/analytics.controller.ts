import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Auth } from '../auth/decorators';
import { Permission } from '../common/enums/permission.enum';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Auth({ permissions: [Permission.ANALYTICS_READ] })
  @Get('dashboard')
  getDashboardStats(@Query('shopId') shopId?: string) {
    return this.analyticsService.getDashboardStats(shopId);
  }

  @Auth({ permissions: [Permission.ANALYTICS_READ] })
  @Get('sales')
  getSalesOverTime(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('shopId') shopId?: string,
  ) {
    return this.analyticsService.getSalesOverTime(
      new Date(startDate),
      new Date(endDate),
      shopId,
    );
  }

  @Auth({ permissions: [Permission.ANALYTICS_READ] })
  @Get('top-products')
  getTopProducts(
    @Query('limit') limit?: string,
    @Query('shopId') shopId?: string,
  ) {
    return this.analyticsService.getTopProducts(
      limit ? parseInt(limit, 10) : 10,
      shopId,
    );
  }

  @Auth({ permissions: [Permission.ANALYTICS_READ] })
  @Get('top-shops')
  getTopShops(@Query('limit') limit?: string) {
    return this.analyticsService.getTopShops(limit ? parseInt(limit, 10) : 10);
  }

  @Auth({ permissions: [Permission.ANALYTICS_READ] })
  @Get('reviews')
  getReviewStats(@Query('shopId') shopId?: string) {
    return this.analyticsService.getReviewStats(shopId);
  }

  @Auth({ permissions: [Permission.ANALYTICS_READ] })
  @Get('order-status')
  getOrderStatusBreakdown(@Query('shopId') shopId?: string) {
    return this.analyticsService.getOrderStatusBreakdown(shopId);
  }
}
