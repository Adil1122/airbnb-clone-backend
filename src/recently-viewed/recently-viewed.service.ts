import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecentlyViewed } from '../entities/recently-viewed.entity';

@Injectable()
export class RecentlyViewedService {
  constructor(
    @InjectRepository(RecentlyViewed) private repo: Repository<RecentlyViewed>,
  ) {}

  async track(userId: number, propertyId: number): Promise<void> {
    const existing = await this.repo.findOne({ where: { userId, propertyId } });
    if (existing) {
      await this.repo.update(existing.id, { viewedAt: new Date() });
    } else {
      await this.repo.save(this.repo.create({ userId, propertyId }));
    }

    // Keep only last 30 items per user
    const all = await this.repo.find({ where: { userId }, order: { viewedAt: 'DESC' } });
    if (all.length > 30) {
      await this.repo.remove(all.slice(30));
    }
  }

  async getRecentlyViewed(userId: number): Promise<RecentlyViewed[]> {
    return this.repo.find({
      where: { userId },
      order: { viewedAt: 'DESC' },
      take: 20,
      relations: ['property'],
    });
  }

  async clear(userId: number): Promise<{ success: boolean }> {
    await this.repo.delete({ userId });
    return { success: true };
  }
}
