import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats(@Query('shopId') shopId?: string) {
    return this.analyticsService.getDashboardStats(shopId);
  }

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

  @Get('top-shops')
  getTopShops(@Query('limit') limit?: string) {
    return this.analyticsService.getTopShops(limit ? parseInt(limit, 10) : 10);
  }

  @Get('reviews')
  getReviewStats(@Query('shopId') shopId?: string) {
    return this.analyticsService.getReviewStats(shopId);
  }

  @Get('order-status')
  getOrderStatusBreakdown(@Query('shopId') shopId?: string) {
    return this.analyticsService.getOrderStatusBreakdown(shopId);
  }
}
