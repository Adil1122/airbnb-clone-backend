import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Property } from '../entities/property.entity';
import { Booking } from '../entities/booking.entity';
import { Review } from '../entities/review.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Property) private propertyRepo: Repository<Property>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
  ) {}

  private assertAdmin(user: any) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required');
  }

  async getDashboard(admin: any) {
    this.assertAdmin(admin);
    const [totalUsers, totalProperties, totalBookings, totalReviews] = await Promise.all([
      this.userRepo.count(),
      this.propertyRepo.count(),
      this.bookingRepo.count(),
      this.reviewRepo.count(),
    ]);
    return { totalUsers, totalProperties, totalBookings, totalReviews };
  }

  async getUsers(admin: any, page = 1, limit = 20, search?: string) {
    this.assertAdmin(admin);
    const where = search ? [{ name: ILike(`%${search}%`) }, { email: ILike(`%${search}%`) }] : {};
    const [users, total] = await this.userRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { users, total, page, limit };
  }

  async banUser(admin: any, userId: number) {
    this.assertAdmin(admin);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'ADMIN') throw new ForbiddenException('Cannot ban another admin');
    user.role = 'BANNED';
    return this.userRepo.save(user);
  }

  async unbanUser(admin: any, userId: number) {
    this.assertAdmin(admin);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.role = 'GUEST';
    return this.userRepo.save(user);
  }

  async getProperties(admin: any, page = 1, limit = 20, search?: string) {
    this.assertAdmin(admin);
    const where = search ? { title: ILike(`%${search}%`) } : {};
    const [properties, total] = await this.propertyRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { properties, total, page, limit };
  }

  async delistProperty(admin: any, propertyId: number) {
    this.assertAdmin(admin);
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    property.isActive = false;
    return this.propertyRepo.save(property);
  }

  async relistProperty(admin: any, propertyId: number) {
    this.assertAdmin(admin);
    const property = await this.propertyRepo.findOne({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    property.isActive = true;
    return this.propertyRepo.save(property);
  }

  async deleteReview(admin: any, reviewId: number) {
    this.assertAdmin(admin);
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    await this.reviewRepo.remove(review);
    return { success: true };
  }

  async getBookings(admin: any, page = 1, limit = 20) {
    this.assertAdmin(admin);
    const [bookings, total] = await this.bookingRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return { bookings, total, page, limit };
  }

  async makeAdmin(admin: any, userId: number) {
    this.assertAdmin(admin);
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.role = 'ADMIN';
    return this.userRepo.save(user);
  }
}
