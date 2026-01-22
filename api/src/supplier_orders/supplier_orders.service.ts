import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SupplierOrder,
  SupplierOrderStatus,
} from './entities/supplier_order.entity';
import { SupplierOrderItem } from './entities/supplier-order-item.entity';
import { CreateSupplierOrderDto } from './dto/create-supplier_order.dto';
import { UpdateSupplierOrderDto } from './dto/update-supplier_order.dto';
import { CreateSupplierOrderItemDto } from './dto/create-supplier-order-item.dto';
import { UpdateSupplierOrderItemDto } from './dto/update-supplier-order-item.dto';

@Injectable()
export class SupplierOrdersService {
  constructor(
    @InjectRepository(SupplierOrder)
    private readonly supplierOrderRepository: Repository<SupplierOrder>,
    @InjectRepository(SupplierOrderItem)
    private readonly supplierOrderItemRepository: Repository<SupplierOrderItem>,
  ) {}

  async create(
    shopId: string,
    createSupplierOrderDto: CreateSupplierOrderDto,
  ): Promise<SupplierOrder> {
    // Calculate total from items (simplified)
    const total = 0; // Would be calculated from items and product prices

    const order = this.supplierOrderRepository.create({
      shopId,
      supplierId: createSupplierOrderDto.supplierId,
      notes: createSupplierOrderDto.notes,
      total,
    });

    return this.supplierOrderRepository.save(order);
  }

  async findAll(): Promise<SupplierOrder[]> {
    return this.supplierOrderRepository.find({
      relations: ['shop', 'supplier', 'items'],
    });
  }

  async findByShop(shopId: string): Promise<SupplierOrder[]> {
    return this.supplierOrderRepository.find({
      where: { shopId },
      relations: ['supplier', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySupplier(supplierId: string): Promise<SupplierOrder[]> {
    return this.supplierOrderRepository.find({
      where: { supplierId },
      relations: ['shop', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<SupplierOrder> {
    const order = await this.supplierOrderRepository.findOne({
      where: { id },
      relations: ['shop', 'supplier', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Supplier order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<SupplierOrder> {
    const order = await this.supplierOrderRepository.findOne({
      where: { orderNumber },
      relations: ['shop', 'supplier', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Supplier order ${orderNumber} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateSupplierOrderDto: UpdateSupplierOrderDto,
  ): Promise<SupplierOrder> {
    const order = await this.findOne(id);
    Object.assign(order, updateSupplierOrderDto);
    return this.supplierOrderRepository.save(order);
  }

  async updateStatus(
    id: string,
    status: SupplierOrderStatus,
  ): Promise<SupplierOrder> {
    const order = await this.findOne(id);
    order.status = status;
    return this.supplierOrderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.supplierOrderRepository.remove(order);
  }

  // ==========================================
  // Supplier Order Item Methods
  // ==========================================

  async createItem(
    createSupplierOrderItemDto: CreateSupplierOrderItemDto,
  ): Promise<SupplierOrderItem> {
    const totalPrice =
      createSupplierOrderItemDto.unitPrice *
      createSupplierOrderItemDto.quantity;

    const item = this.supplierOrderItemRepository.create({
      ...createSupplierOrderItemDto,
      totalPrice,
    });

    return this.supplierOrderItemRepository.save(item);
  }

  async findAllItems(): Promise<SupplierOrderItem[]> {
    return this.supplierOrderItemRepository.find({
      relations: ['order', 'product'],
    });
  }

  async findItemsByOrder(orderId: string): Promise<SupplierOrderItem[]> {
    return this.supplierOrderItemRepository.find({
      where: { orderId },
      relations: ['product'],
    });
  }

  async findOneItem(id: string): Promise<SupplierOrderItem> {
    const item = await this.supplierOrderItemRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });

    if (!item) {
      throw new NotFoundException(
        `Supplier order item with ID ${id} not found`,
      );
    }

    return item;
  }

  async updateItem(
    id: string,
    updateSupplierOrderItemDto: UpdateSupplierOrderItemDto,
  ): Promise<SupplierOrderItem> {
    const item = await this.findOneItem(id);
    Object.assign(item, updateSupplierOrderItemDto);

    if (
      updateSupplierOrderItemDto.quantity ||
      updateSupplierOrderItemDto.unitPrice
    ) {
      item.totalPrice = item.unitPrice * item.quantity;
    }

    return this.supplierOrderItemRepository.save(item);
  }

  async removeItem(id: string): Promise<void> {
    const item = await this.findOneItem(id);
    await this.supplierOrderItemRepository.remove(item);
  }
}
