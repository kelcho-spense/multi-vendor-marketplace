import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(SupplierProduct)
    private readonly supplierProductRepository: Repository<SupplierProduct>,
  ) {}

  async create(
    userId: string,
    createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { userId },
    });

    if (existingSupplier) {
      throw new ConflictException('User already has a supplier profile');
    }

    const supplier = this.supplierRepository.create({
      ...createSupplierDto,
      userId,
    });

    return this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      relations: ['user'],
    });
  }

  async findVerified(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      where: { verified: true },
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['user', 'products'],
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async findByUser(userId: string): Promise<Supplier | null> {
    return this.supplierRepository.findOne({
      where: { userId },
      relations: ['products'],
    });
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async verify(id: string): Promise<Supplier> {
    const supplier = await this.findOne(id);
    supplier.verified = true;
    return this.supplierRepository.save(supplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.supplierRepository.remove(supplier);
  }

  // Supplier Products
  async findSupplierProducts(supplierId: string): Promise<SupplierProduct[]> {
    return this.supplierProductRepository.find({
      where: { supplierId },
      relations: ['category'],
    });
  }
}
