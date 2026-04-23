import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Property } from '../entities/property.entity';
import { Amenity } from '../entities/amenity.entity';
import { PropertyImage } from '../entities/property-image.entity';
import { Category } from '../entities/category.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { HostAction } from '../entities/host-action.entity';
import { PropertyAvailability } from '../entities/property-availability.entity';
import { PropertyRule } from '../entities/property-rule.entity';
import { User } from '../entities/user.entity';
import { Review } from '../entities/review.entity';
import { 
  UpdateBasicsDto, 
  UpdateFloorPlanDto, 
  UpdateContentDto, 
  UpdatePricingDto, 
  UpdatePoliciesDto,
  UpdateAmenitiesDto,
  UpdateArrivalGuideDto,
  UpdateCalendarDto
} from './host.dto';

@Injectable()
export class HostService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
    @InjectRepository(PropertyImage)
    private imageRepository: Repository<PropertyImage>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(HostAction)
    private actionRepository: Repository<HostAction>,
    @InjectRepository(PropertyAvailability)
    private availabilityRepository: Repository<PropertyAvailability>,
    @InjectRepository(PropertyRule)
    private ruleRepository: Repository<PropertyRule>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getDashboard(userId: number) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Fetch properties owned by host
    const properties = await this.propertyRepository.find({ where: { hostId: userId } });
    const propertyIds = properties.map(p => p.id);

    if (propertyIds.length === 0) {
      return {
        checkingIn: 0,
        checkingOut: 0,
        currentlyHosting: 0,
        upcoming: 0,
        pendingReview: 0,
        actions: await this.actionRepository.find({ where: { hostId: userId, isCompleted: false } })
      };
    }

    const checkIns = await this.bookingRepository.count({
      where: { propertyId: Between(propertyIds[0], propertyIds[propertyIds.length - 1]), checkIn: today, status: BookingStatus.CONFIRMED }
    });
    // Note: The above is a simplified query. TypeORM 'In' would be better.
    
    const checkingIn = await this.bookingRepository.find({
        where: { checkIn: today, status: BookingStatus.CONFIRMED }
    });
    const checkingOut = await this.bookingRepository.find({
        where: { checkOut: today, status: BookingStatus.CONFIRMED }
    });

    // Real implementation would filter by propertyIds
    const hostBookings = await this.bookingRepository.find({
        where: { status: BookingStatus.CONFIRMED }
    });
    
    const filteredCheckingIn = hostBookings.filter(b => propertyIds.includes(b.propertyId) && b.checkIn.getTime() === today.getTime());
    const filteredCheckingOut = hostBookings.filter(b => propertyIds.includes(b.propertyId) && b.checkOut.getTime() === today.getTime());

    const actions = await this.actionRepository.find({ where: { hostId: userId, isCompleted: false } });

    return {
      checkingIn: filteredCheckingIn.length,
      checkingOut: filteredCheckingOut.length,
      currentlyHosting: 0, // Simplified
      upcoming: hostBookings.filter(b => propertyIds.includes(b.propertyId) && b.checkIn > today).length,
      pendingReview: 0,
      actions
    };
  }

  async getListings(userId: number) {
    return this.propertyRepository.find({
      where: { hostId: userId },
      relations: ['images', 'category']
    });
  }

  async updateArrivalGuide(id: number, userId: number, dto: UpdateArrivalGuideDto) {
    const property = await this.findOneOwned(id, userId);
    Object.assign(property, dto);
    return this.propertyRepository.save(property);
  }

  async updateCalendar(id: number, userId: number, dto: UpdateCalendarDto) {
    await this.findOneOwned(id, userId);
    
    let availability = await this.availabilityRepository.findOne({
      where: { propertyId: id, date: new Date(dto.date) }
    });

    if (!availability) {
      availability = this.availabilityRepository.create({
        propertyId: id,
        date: new Date(dto.date)
      });
    }

    if (dto.priceOverride !== undefined) availability.priceOverride = dto.priceOverride;
    if (dto.isAvailable !== undefined) availability.isAvailable = dto.isAvailable;

    return this.availabilityRepository.save(availability);
  }

  async initiateListing(userId: number): Promise<Property> {

    const property = this.propertyRepository.create({
      hostId: userId,
      status: 'DRAFT',
      title: 'Untitiled Listing',
      location: '',
      price: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: '',
      type: '',
    });
    return this.propertyRepository.save(property);
  }

  async findOneOwned(id: number, userId: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({ 
      where: { id },
      relations: ['amenities', 'category', 'images']
    });
    if (!property) {
      throw new NotFoundException('Listing not found');
    }
    if (property.hostId !== userId) {
      throw new ForbiddenException('You do not own this listing');
    }
    return property;
  }

  async updateBasics(id: number, userId: number, dto: UpdateBasicsDto): Promise<Property> {
    const property = await this.findOneOwned(id, userId);
    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      property.category = category;
    }
    if (dto.type) property.type = dto.type;
    if (dto.location) property.location = dto.location;
    return this.propertyRepository.save(property);
  }

  async updateFloorPlan(id: number, userId: number, dto: UpdateFloorPlanDto): Promise<Property> {
    const property = await this.findOneOwned(id, userId);
    Object.assign(property, dto);
    return this.propertyRepository.save(property);
  }

  async updateContent(id: number, userId: number, dto: UpdateContentDto): Promise<Property> {
    const property = await this.findOneOwned(id, userId);
    if (dto.title !== undefined) property.title = dto.title;
    if (dto.description !== undefined) property.description = dto.description;
    return this.propertyRepository.save(property);
  }

  async updatePricing(id: number, userId: number, dto: UpdatePricingDto): Promise<Property> {
    const property = await this.findOneOwned(id, userId);
    if (dto.price !== undefined) property.price = dto.price;
    if (dto.weekendPrice !== undefined) property.weekendPrice = dto.weekendPrice;
    if (dto.weeklyDiscount !== undefined) property.weeklyDiscount = dto.weeklyDiscount;
    return this.propertyRepository.save(property);
  }

  async updatePolicies(id: number, userId: number, dto: UpdatePoliciesDto): Promise<Property> {
    const property = await this.findOneOwned(id, userId);
    if (dto.allowPets !== undefined) property.allowPets = dto.allowPets;
    return this.propertyRepository.save(property);
  }

  async updateAmenities(id: number, userId: number, dto: UpdateAmenitiesDto): Promise<void> {
    await this.findOneOwned(id, userId);
    
    // Delete existing amenities for this property
    await this.amenityRepository.delete({ propertyId: id });
    
    // Create new ones
    const amenities = dto.amenities.map(name => 
      this.amenityRepository.create({
        name,
        propertyId: id,
        icon: 'default_icon', // Placeholder
      })
    );
    await this.amenityRepository.save(amenities);
  }

  async addImage(id: number, userId: number, fileUrl: string): Promise<PropertyImage> {
    const property = await this.findOneOwned(id, userId);
    
    const image = this.imageRepository.create({
      url: fileUrl,
      property: property,
      category: 'Additional images',
    });
    
    const savedImage = await this.imageRepository.save(image);
    
    // Update property main imageUrl if it's the first one
    if (!property.imageUrl) {
      property.imageUrl = fileUrl;
      await this.propertyRepository.save(property);
    }
    
    return savedImage;
  }


  async verifyIdentity(userId: number): Promise<void> {
    await this.userRepository.update(userId, { isIdentityVerified: true });
  }

  async verifyPhone(userId: number): Promise<void> {
    await this.userRepository.update(userId, { isPhoneVerified: true });
  }

  async sendOtp(phone: string): Promise<{ message: string; otp: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('\n========================================');
    console.log('📱 SMS OTP SIMULATION');
    console.log('========================================');
    console.log(`To: ${phone}`);
    console.log(`OTP Code: ${otp}`);
    console.log('========================================\n');
    return { message: 'OTP sent successfully', otp };
  }

  async publishListing(id: number, userId: number): Promise<void> {
    await this.propertyRepository.update({ id, hostId: userId }, { status: 'PUBLISHED' });
  }

  async remove(id: number, userId: number): Promise<void> {
    const property = await this.findOneOwned(id, userId);
    
    // Manually cleanup relations to avoid foreign key constraint errors
    await this.amenityRepository.delete({ property: { id } });
    await this.imageRepository.delete({ property: { id } });
    await this.bookingRepository.delete({ propertyId: id });
    await this.availabilityRepository.delete({ propertyId: id });
    await this.ruleRepository.delete({ propertyId: id });
    await this.reviewRepository.delete({ propertyId: id });
    
    // Remove the property itself
    await this.propertyRepository.remove(property);
  }
}
