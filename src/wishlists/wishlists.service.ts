import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistItem } from '../entities/wishlist-item.entity';
import { CreateWishlistDto, UpdateWishlistDto, AddWishlistItemDto } from './wishlists.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepo: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private itemRepo: Repository<WishlistItem>,
  ) {}

  async getUserWishlists(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepo.find({
      where: { userId },
      relations: ['items', 'items.property', 'items.property.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, dto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = this.wishlistRepo.create({ ...dto, userId });
    return this.wishlistRepo.save(wishlist);
  }

  async update(id: number, userId: number, dto: UpdateWishlistDto): Promise<Wishlist> {
    const wishlist = await this.findOwned(id, userId);
    Object.assign(wishlist, dto);
    return this.wishlistRepo.save(wishlist);
  }

  async delete(id: number, userId: number): Promise<void> {
    const wishlist = await this.findOwned(id, userId);
    await this.wishlistRepo.remove(wishlist);
  }

  async addItem(wishlistId: number, userId: number, dto: AddWishlistItemDto): Promise<WishlistItem> {
    await this.findOwned(wishlistId, userId);
    const existing = await this.itemRepo.findOne({ where: { wishlistId, propertyId: dto.propertyId } });
    if (existing) throw new ConflictException('Property already in this wishlist');
    const item = this.itemRepo.create({ wishlistId, ...dto });
    return this.itemRepo.save(item);
  }

  async removeItem(wishlistId: number, itemId: number, userId: number): Promise<void> {
    await this.findOwned(wishlistId, userId);
    const item = await this.itemRepo.findOne({ where: { id: itemId, wishlistId } });
    if (!item) throw new NotFoundException('Item not found');
    await this.itemRepo.remove(item);
  }

  async checkProperty(userId: number, propertyId: number): Promise<{ isSaved: boolean; wishlistIds: number[] }> {
    const wishlists = await this.wishlistRepo.find({ where: { userId }, relations: ['items'] });
    const wishlistIds: number[] = [];
    for (const w of wishlists) {
      if (w.items?.some((i) => i.propertyId === propertyId)) {
        wishlistIds.push(w.id);
      }
    }
    return { isSaved: wishlistIds.length > 0, wishlistIds };
  }

  private async findOwned(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepo.findOne({ where: { id } });
    if (!wishlist) throw new NotFoundException('Wishlist not found');
    if (wishlist.userId !== userId) throw new ForbiddenException('Not your wishlist');
    return wishlist;
  }
}
