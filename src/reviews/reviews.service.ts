import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewType } from '../entities/review.entity';
import { Property } from '../entities/property.entity';
import { CreateReviewDto, RespondToReviewDto } from './reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
  ) {}

  async getByListing(propertyId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { propertyId, isPublic: true, type: ReviewType.GUEST_TO_HOST },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getByUser(userId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { userId },
      relations: ['property', 'property.images'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: number, dto: CreateReviewDto): Promise<Review> {
    const today = new Date().toISOString().split('T')[0];
    const review = this.reviewRepo.create({
      ...dto,
      userId,
      reviewerId: userId,
      type: dto.type ?? ReviewType.GUEST_TO_HOST,
      reviewDate: today,
    });
    const saved = await this.reviewRepo.save(review);

    // Update property rating
    await this.recalculatePropertyRating(dto.propertyId);

    return saved;
  }

  async respondToReview(reviewId: number, hostUserId: number, dto: RespondToReviewDto): Promise<Review> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId },
      relations: ['property'],
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.property?.hostId !== hostUserId) {
      throw new ForbiddenException('Only the host can respond to this review');
    }
    review.response = dto.response;
    review.respondedAt = new Date();
    return this.reviewRepo.save(review);
  }

  async getListingRatingSummary(propertyId: number) {
    const result = await this.reviewRepo
      .createQueryBuilder('r')
      .select([
        'AVG(r.rating) as overall',
        'AVG(r.cleanlinessRating) as cleanliness',
        'AVG(r.accuracyRating) as accuracy',
        'AVG(r.checkinRating) as checkin',
        'AVG(r.communicationRating) as communication',
        'AVG(r.locationRating) as location',
        'AVG(r.valueRating) as value',
        'COUNT(r.id) as total',
      ])
      .where('r.propertyId = :propertyId', { propertyId })
      .andWhere('r.isPublic = true')
      .andWhere('r.type = :type', { type: ReviewType.GUEST_TO_HOST })
      .getRawOne();

    return {
      overall: parseFloat(result.overall) || 0,
      cleanliness: parseFloat(result.cleanliness) || 0,
      accuracy: parseFloat(result.accuracy) || 0,
      checkin: parseFloat(result.checkin) || 0,
      communication: parseFloat(result.communication) || 0,
      location: parseFloat(result.location) || 0,
      value: parseFloat(result.value) || 0,
      total: parseInt(result.total) || 0,
    };
  }

  private async recalculatePropertyRating(propertyId: number): Promise<void> {
    const { overall, total } = await this.getListingRatingSummary(propertyId);
    await this.propertyRepo.update(propertyId, {
      rating: parseFloat(overall.toFixed(2)),
      reviewCount: total,
    });
  }
}
