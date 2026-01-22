import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { Shop } from '../shops/entities/shop.entity';
import { User } from '../users/entities/user.entity';
import { Review } from '../reviews/entities/review.entity';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrders: number;
}

export interface SalesOverTime {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  revenue: number;
}

export interface TopShop {
  shopId: string;
  shopName: string;
  totalOrders: number;
  revenue: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getDashboardStats(shopId?: string): Promise<DashboardStats> {
    const orderQuery = this.orderRepository.createQueryBuilder('order');

    if (shopId) {
      orderQuery.where('order.shop_id = :shopId', { shopId });
    }

    const orders = await orderQuery.getMany();

    const completedOrders = orders.filter(
      (o) => o.status === OrderStatus.DELIVERED,
    );
    const pendingOrders = orders.filter(
      (o) =>
        o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING,
    );

    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0,
    );
    const totalOrders = orders.length;
    const averageOrderValue =
      completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    const productQuery = this.productRepository.createQueryBuilder('product');
    if (shopId) {
      productQuery.where('product.shop_id = :shopId', { shopId });
    }
    const totalProducts = await productQuery.getCount();

    const totalCustomers = await this.userRepository.count();

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      averageOrderValue,
      pendingOrders: pendingOrders.length,
    };
  }

  async getSalesOverTime(
    startDate: Date,
    endDate: Date,
    shopId?: string,
  ): Promise<SalesOverTime[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.created_at)', 'date')
      .addSelect('SUM(order.total)', 'revenue')
      .addSelect('COUNT(order.id)', 'orders')
      .where('order.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('order.status = :status', { status: OrderStatus.DELIVERED });

    if (shopId) {
      query.andWhere('order.shop_id = :shopId', { shopId });
    }

    const results = await query
      .groupBy('DATE(order.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      date: r.date,
      revenue: Number(r.revenue) || 0,
      orders: Number(r.orders) || 0,
    }));
  }

  async getTopProducts(limit = 10, shopId?: string): Promise<TopProduct[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'totalSold')
      .addSelect('SUM(item.total_price)', 'revenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED });

    if (shopId) {
      query.andWhere('order.shop_id = :shopId', { shopId });
    }

    const results = await query
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('totalSold', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      productId: r.productId,
      productName: r.productName,
      totalSold: Number(r.totalSold) || 0,
      revenue: Number(r.revenue) || 0,
    }));
  }

  async getTopShops(limit = 10): Promise<TopShop[]> {
    const results = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.shop', 'shop')
      .select('shop.id', 'shopId')
      .addSelect('shop.name', 'shopName')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .addSelect('SUM(order.total)', 'revenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .groupBy('shop.id')
      .addGroupBy('shop.name')
      .orderBy('revenue', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      shopId: r.shopId,
      shopName: r.shopName,
      totalOrders: Number(r.totalOrders) || 0,
      revenue: Number(r.revenue) || 0,
    }));
  }

  async getReviewStats(shopId?: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    const query = this.reviewRepository.createQueryBuilder('review');

    if (shopId) {
      query.where('review.shop_id = :shopId', { shopId });
    }

    const reviews = await query.getMany();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    reviews.forEach((r) => {
      if (ratingDistribution[r.rating] !== undefined) {
        ratingDistribution[r.rating]++;
      }
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  }

  async getOrderStatusBreakdown(
    shopId?: string,
  ): Promise<Record<string, number>> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count');

    if (shopId) {
      query.where('order.shop_id = :shopId', { shopId });
    }

    const results = await query.groupBy('order.status').getRawMany();

    const breakdown: Record<string, number> = {};
    results.forEach((r) => {
      breakdown[r.status] = Number(r.count) || 0;
    });

    return breakdown;
  }
}
