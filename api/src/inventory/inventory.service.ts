import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Inventory,
  InventoryTransactionType,
} from './entities/inventory.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(InventoryTransaction)
    private readonly transactionRepository: Repository<InventoryTransaction>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(createInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['product', 'shop'],
    });
  }

  async findOne(id: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'shop'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async findByProduct(productId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { productId },
      relations: ['shop'],
    });
  }

  async findByShop(shopId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { shopId },
      relations: ['product'],
    });
  }

  async findByProductAndShop(
    productId: string,
    shopId: string,
  ): Promise<Inventory | null> {
    return this.inventoryRepository.findOne({
      where: { productId, shopId },
      relations: ['product', 'shop'],
    });
  }

  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.findOne(id);
    Object.assign(inventory, updateInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOne(id);
    await this.inventoryRepository.remove(inventory);
  }

  // ==========================================
  // Stock Management Methods
  // ==========================================

  async adjustStock(
    adjustInventoryDto: AdjustInventoryDto,
    userId?: string,
  ): Promise<Inventory> {
    const { inventoryId, type, quantity, reason, referenceId } =
      adjustInventoryDto;

    const inventory = await this.findOne(inventoryId);
    const previousQuantity = inventory.quantity;

    let newQuantity: number;

    switch (type) {
      case InventoryTransactionType.STOCK_IN:
      case InventoryTransactionType.RETURN:
        newQuantity = previousQuantity + quantity;
        break;
      case InventoryTransactionType.STOCK_OUT:
      case InventoryTransactionType.DAMAGE:
        if (previousQuantity < quantity) {
          throw new BadRequestException('Insufficient stock');
        }
        newQuantity = previousQuantity - quantity;
        break;
      case InventoryTransactionType.ADJUSTMENT:
        newQuantity = quantity; // Direct set
        break;
      default:
        newQuantity = previousQuantity;
    }

    // Update inventory
    inventory.quantity = newQuantity;
    if (type === InventoryTransactionType.STOCK_IN) {
      inventory.lastRestockedAt = new Date();
    }

    await this.inventoryRepository.save(inventory);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      inventoryId,
      type,
      quantity,
      previousQuantity,
      newQuantity,
      reason,
      referenceId,
      performedBy: userId,
    });

    await this.transactionRepository.save(transaction);

    return inventory;
  }

  async reserveStock(
    inventoryId: string,
    quantity: number,
  ): Promise<Inventory> {
    const inventory = await this.findOne(inventoryId);

    if (inventory.availableQuantity < quantity) {
      throw new BadRequestException('Insufficient available stock');
    }

    inventory.reservedQuantity += quantity;
    return this.inventoryRepository.save(inventory);
  }

  async releaseReservedStock(
    inventoryId: string,
    quantity: number,
  ): Promise<Inventory> {
    const inventory = await this.findOne(inventoryId);

    inventory.reservedQuantity = Math.max(
      0,
      inventory.reservedQuantity - quantity,
    );
    return this.inventoryRepository.save(inventory);
  }

  async commitReservedStock(
    inventoryId: string,
    quantity: number,
    userId?: string,
  ): Promise<Inventory> {
    const inventory = await this.findOne(inventoryId);

    if (inventory.reservedQuantity < quantity) {
      throw new BadRequestException('Invalid reserved quantity');
    }

    // Reduce both reserved and actual quantity
    inventory.reservedQuantity -= quantity;
    inventory.quantity -= quantity;

    await this.inventoryRepository.save(inventory);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      inventoryId,
      type: InventoryTransactionType.STOCK_OUT,
      quantity,
      previousQuantity: inventory.quantity + quantity,
      newQuantity: inventory.quantity,
      reason: 'Order fulfilled',
      performedBy: userId,
    });

    await this.transactionRepository.save(transaction);

    return inventory;
  }

  // ==========================================
  // Alert Methods
  // ==========================================

  async getLowStockItems(shopId?: string): Promise<Inventory[]> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.shop', 'shop')
      .where(
        'inventory.quantity - inventory.reserved_quantity <= inventory.low_stock_threshold',
      );

    if (shopId) {
      query.andWhere('inventory.shop_id = :shopId', { shopId });
    }

    return query.getMany();
  }

  async getReorderItems(shopId?: string): Promise<Inventory[]> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.shop', 'shop')
      .where(
        'inventory.quantity - inventory.reserved_quantity <= inventory.reorder_point',
      );

    if (shopId) {
      query.andWhere('inventory.shop_id = :shopId', { shopId });
    }

    return query.getMany();
  }

  async getTransactionHistory(
    inventoryId: string,
  ): Promise<InventoryTransaction[]> {
    return this.transactionRepository.find({
      where: { inventoryId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
