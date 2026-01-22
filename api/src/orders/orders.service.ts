import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserRole } from '../common/enums/user.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Calculate totals (simplified - in production, fetch product prices)
    const subtotal = 0; // Would be calculated from items
    const tax = 0;
    const shippingCost = 0;
    const total = subtotal + tax + shippingCost;

    const order = this.orderRepository.create({
      userId,
      shopId: createOrderDto.shopId,
      shippingAddress: createOrderDto.shippingAddress,
      billingAddress: createOrderDto.billingAddress,
      paymentMethod: createOrderDto.paymentMethod,
      notes: createOrderDto.notes,
      subtotal,
      tax,
      shippingCost,
      total,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const items = createOrderDto.items.map((item) =>
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: 0, // Would be fetched from product
        totalPrice: 0,
      }),
    );

    await this.orderItemRepository.save(items);

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'shop', 'items'],
    });
  }

  /**
   * Find orders based on user role:
   * - ADMIN: can see all orders
   * - SHOP_OWNER: can see orders for their shops (simplified: all for now)
   * - SHOPPER: can only see their own orders
   */
  async findAllForUser(userId: string, role: UserRole): Promise<Order[]> {
    if (role === UserRole.ADMIN) {
      return this.findAll();
    }

    // For shoppers (and suppliers who shouldn't access orders), only show their own
    return this.findByUser(userId);
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['shop', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByShop(shopId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { shopId },
      relations: ['user', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'shop', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Find a single order with ownership verification
   */
  async findOneForUser(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<Order> {
    const order = await this.findOne(id);

    // Admins can access any order
    if (role === UserRole.ADMIN) {
      return order;
    }

    // Shop owners can access orders for their shops
    // TODO: Add shop ownership check when Shop entity has ownerId
    // if (role === UserRole.SHOP_OWNER && order.shop?.ownerId === userId) {
    //   return order;
    // }

    // Users can only access their own orders
    if (order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['user', 'shop', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
  ): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
