import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface ProductFilter {
  shopId?: string;
  categoryId?: string;
  status?: ProductStatus;
  search?: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingSku = await this.productRepository.findOne({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException('Product SKU already exists');
    }

    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(filter?: ProductFilter): Promise<Product[]> {
    const where: FindOptionsWhere<Product> = {};

    if (filter?.shopId) where.shopId = filter.shopId;
    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.status) where.status = filter.status;
    if (filter?.search) where.name = Like(`%${filter.search}%`);

    return this.productRepository.find({
      where,
      relations: ['shop', 'category'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shop', 'category', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['shop', 'category', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async findByShop(shopId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { shopId },
      relations: ['category'],
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException('Product SKU already exists');
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockQty = Math.max(0, product.stockQty + quantity);

    if (product.stockQty === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }

    return this.productRepository.save(product);
  }
}
