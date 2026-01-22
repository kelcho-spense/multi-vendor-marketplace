import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import {
  ShopSupplier,
  ShopSupplierStatus,
} from './entities/shop-supplier.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { CreateShopSupplierDto } from './dto/create-shop-supplier.dto';
import { UpdateShopSupplierDto } from './dto/update-shop-supplier.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(ShopSupplier)
    private readonly shopSupplierRepository: Repository<ShopSupplier>,
  ) {}

  async create(ownerId: string, createShopDto: CreateShopDto): Promise<Shop> {
    if (createShopDto.slug) {
      const existingShop = await this.shopRepository.findOne({
        where: { slug: createShopDto.slug },
      });

      if (existingShop) {
        throw new ConflictException('Shop slug already exists');
      }
    }

    const shop = this.shopRepository.create({
      ...createShopDto,
      ownerId,
    });

    return this.shopRepository.save(shop);
  }

  async findAll(): Promise<Shop[]> {
    return this.shopRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: { id },
      relations: ['owner', 'products'],
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    return shop;
  }

  async findBySlug(slug: string): Promise<Shop> {
    const shop = await this.shopRepository.findOne({
      where: { slug },
      relations: ['owner', 'products'],
    });

    if (!shop) {
      throw new NotFoundException(`Shop with slug ${slug} not found`);
    }

    return shop;
  }

  async findByOwner(ownerId: string): Promise<Shop[]> {
    return this.shopRepository.find({
      where: { ownerId },
    });
  }

  async update(id: string, updateShopDto: UpdateShopDto): Promise<Shop> {
    const shop = await this.findOne(id);

    if (updateShopDto.slug && updateShopDto.slug !== shop.slug) {
      const existingShop = await this.shopRepository.findOne({
        where: { slug: updateShopDto.slug },
      });

      if (existingShop) {
        throw new ConflictException('Shop slug already exists');
      }
    }

    Object.assign(shop, updateShopDto);
    return this.shopRepository.save(shop);
  }

  async remove(id: string): Promise<void> {
    const shop = await this.findOne(id);
    await this.shopRepository.remove(shop);
  }

  // ==========================================
  // Shop Supplier Methods
  // ==========================================

  async createSupplierRelation(
    createShopSupplierDto: CreateShopSupplierDto,
  ): Promise<ShopSupplier> {
    const existing = await this.shopSupplierRepository.findOne({
      where: {
        shopId: createShopSupplierDto.shopId,
        supplierId: createShopSupplierDto.supplierId,
      },
    });

    if (existing) {
      throw new ConflictException('Shop-Supplier relationship already exists');
    }

    const shopSupplier = this.shopSupplierRepository.create(
      createShopSupplierDto,
    );
    return this.shopSupplierRepository.save(shopSupplier);
  }

  async findAllSupplierRelations(): Promise<ShopSupplier[]> {
    return this.shopSupplierRepository.find({
      relations: ['shop', 'supplier'],
    });
  }

  async findSuppliersByShop(shopId: string): Promise<ShopSupplier[]> {
    return this.shopSupplierRepository.find({
      where: { shopId },
      relations: ['supplier'],
    });
  }

  async findShopsBySupplier(supplierId: string): Promise<ShopSupplier[]> {
    return this.shopSupplierRepository.find({
      where: { supplierId },
      relations: ['shop'],
    });
  }

  async findOneSupplierRelation(id: string): Promise<ShopSupplier> {
    const shopSupplier = await this.shopSupplierRepository.findOne({
      where: { id },
      relations: ['shop', 'supplier'],
    });

    if (!shopSupplier) {
      throw new NotFoundException(
        `Shop-Supplier relationship with ID ${id} not found`,
      );
    }

    return shopSupplier;
  }

  async updateSupplierRelation(
    id: string,
    updateShopSupplierDto: UpdateShopSupplierDto,
  ): Promise<ShopSupplier> {
    const shopSupplier = await this.findOneSupplierRelation(id);
    Object.assign(shopSupplier, updateShopSupplierDto);
    return this.shopSupplierRepository.save(shopSupplier);
  }

  async updateSupplierRelationStatus(
    id: string,
    status: ShopSupplierStatus,
  ): Promise<ShopSupplier> {
    const shopSupplier = await this.findOneSupplierRelation(id);
    shopSupplier.status = status;
    return this.shopSupplierRepository.save(shopSupplier);
  }

  async removeSupplierRelation(id: string): Promise<void> {
    const shopSupplier = await this.findOneSupplierRelation(id);
    await this.shopSupplierRepository.remove(shopSupplier);
  }
}
