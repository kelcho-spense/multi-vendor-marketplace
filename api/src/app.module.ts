import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import databaseConfig, { DatabaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { ShopsModule } from './shops/shops.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SupplierOrdersModule } from './supplier_orders/supplier_orders.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute
          limit: 100, // 100 requests per minute (global default)
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<DatabaseConfig>('database');
        return {
          type: 'postgres' as const,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
        };
      },
    }),
    UsersModule,
    ShopsModule,
    SuppliersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartsModule,
    ReviewsModule,
    SupplierOrdersModule,
    AuthModule,
    InventoryModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
