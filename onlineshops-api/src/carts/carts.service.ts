import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(userId: string, createCartDto: CreateCartDto): Promise<Cart> {
    // Check if cart already exists for this user and shop
    const existingCart = await this.cartRepository.findOne({
      where: { userId, shopId: createCartDto.shopId },
    });

    if (existingCart) {
      return existingCart;
    }

    const cart = this.cartRepository.create({
      userId,
      shopId: createCartDto.shopId,
    });

    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['user', 'shop', 'items', 'items.product'],
    });
  }

  async findByUser(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { userId },
      relations: ['shop', 'items', 'items.product'],
    });
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'shop', 'items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async findByUserAndShop(
    userId: string,
    shopId: string,
  ): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId, shopId },
      relations: ['items', 'items.product'],
    });
  }

  async getOrCreate(userId: string, shopId: string): Promise<Cart> {
    let cart = await this.findByUserAndShop(userId, shopId);

    if (!cart) {
      cart = await this.create(userId, { shopId });
    }

    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    Object.assign(cart, updateCartDto);
    return this.cartRepository.save(cart);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }

  async clearCart(id: string): Promise<void> {
    const cart = await this.findOne(id);
    cart.items = [];
    await this.cartRepository.save(cart);
  }

  // ==========================================
  // Cart Item Methods
  // ==========================================

  async createItem(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const { cartId, productId, quantity = 1 } = createCartItemDto;

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepository.findOne({
      where: { cartId, productId },
    });

    if (existingItem) {
      // Add to existing quantity instead of creating new
      existingItem.quantity += quantity;
      return this.cartItemRepository.save(existingItem);
    }

    const item = this.cartItemRepository.create({
      cartId,
      productId,
      quantity,
    });

    return this.cartItemRepository.save(item);
  }

  async findAllItems(): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      relations: ['cart', 'product'],
    });
  }

  async findItemsByCart(cartId: string): Promise<CartItem[]> {
    return this.cartItemRepository.find({
      where: { cartId },
      relations: ['product'],
    });
  }

  async findOneItem(id: string): Promise<CartItem> {
    const item = await this.cartItemRepository.findOne({
      where: { id },
      relations: ['cart', 'product'],
    });

    if (!item) {
      throw new NotFoundException(`Cart item with ID ${id} not found`);
    }

    return item;
  }

  async updateItem(
    id: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const item = await this.findOneItem(id);
    Object.assign(item, updateCartItemDto);
    return this.cartItemRepository.save(item);
  }

  async updateItemQuantity(id: string, quantity: number): Promise<CartItem> {
    const item = await this.findOneItem(id);
    item.quantity = quantity;
    return this.cartItemRepository.save(item);
  }

  async removeItem(id: string): Promise<void> {
    const item = await this.findOneItem(id);
    await this.cartItemRepository.remove(item);
  }

  async addToCart(
    cartId: string,
    productId: string,
    quantity = 1,
  ): Promise<CartItem> {
    return this.createItem({ cartId, productId, quantity });
  }
}
