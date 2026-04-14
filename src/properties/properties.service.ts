import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { Amenity } from '../entities/amenity.entity';
import { Review } from '../entities/review.entity';
import { PropertyRule } from '../entities/property-rule.entity';
import { RuleCategory } from '../entities/rule-category.entity';

@Injectable()
export class PropertiesService {
    constructor(
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
        @InjectRepository(Amenity)
        private amenityRepository: Repository<Amenity>,
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>,
        @InjectRepository(PropertyRule)
        private rulesRepository: Repository<PropertyRule>,
        @InjectRepository(RuleCategory)
        private ruleCategoriesRepository: Repository<RuleCategory>,
    ) { }

    findAll(categoryId?: number): Promise<Property[]> {
        if (categoryId) {
            return this.propertyRepository.find({
                where: { category: { id: categoryId } },
                relations: ['category'],
            });
        }
        return this.propertyRepository.find({ relations: ['category'] });
    }

    async findOne(id: number): Promise<Property | null> {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['category', 'images'],
        });
        
        if (property) {
            property.rules = await this.findRules(id);
        }
        
        return property;
    }

    findAmenities(propertyId: number): Promise<Amenity[]> {
        return this.amenityRepository.find({
            where: { propertyId },
        });
    }

    findReviews(propertyId: number): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { propertyId },
            relations: ['user'],
            order: { reviewDate: 'DESC' },
        });
    }

    async findRules(propertyId: number): Promise<PropertyRule[]> {
        const rules = await this.rulesRepository.find({
            where: { propertyId },
            order: { categoryName: 'ASC', sortOrder: 'ASC' },
        });
        return rules;
    }

    async findRuleCategories(): Promise<RuleCategory[]> {
        return this.ruleCategoriesRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }

    async search(params: {
        location?: string;
        startDate?: string;
        endDate?: string;
        monthsCount?: number;
        flexibleType?: string;
        flexibleMonths?: string[];
        adults?: number;
        children?: number;
        infants?: number;
        pets?: boolean;
    }): Promise<Property[]> {
        const { location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children, infants, pets } = params;
        const query = this.propertyRepository.createQueryBuilder('property');

        if (location) {
            query.andWhere('property.location LIKE :location', { location: `%${location}%` });
        }

        if (startDate) {
            const sDate = new Date(startDate);
            query.andWhere('property.availableFrom <= :sDate', { sDate });
            if (endDate) {
                const eDate = new Date(endDate);
                query.andWhere('property.availableTo >= :eDate', { eDate });
            }
        }

        if (monthsCount) {
            const today = new Date();
            const future = new Date();
            future.setMonth(today.getMonth() + monthsCount);
            query.andWhere('property.availableFrom <= :today', { today });
            query.andWhere('property.availableTo >= :future', { future });
        }

        if (flexibleMonths && flexibleMonths.length > 0) {
            const monthMap: Record<string, number> = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };

            const conditions = flexibleMonths.map((m, i) => {
                const monthIdx = monthMap[m];
                const startOfMonth = new Date(2026, monthIdx, 1);
                const endOfMonth = new Date(2026, monthIdx + 1, 0);
                return `(property.availableFrom <= :eom${i} AND property.availableTo >= :som${i})`;
            }).join(' OR ');

            const parameters: any = {};
            flexibleMonths.forEach((m, i) => {
                const monthIdx = monthMap[m];
                parameters[`som${i}`] = new Date(2026, monthIdx, 1);
                parameters[`eom${i}`] = new Date(2026, monthIdx + 1, 0);
            });

            query.andWhere(`(${conditions})`, parameters);
        }

        if (adults) {
            query.andWhere('property.maxAdults >= :adults', { adults });
        }

        if (children) {
            query.andWhere('property.maxChildren >= :children', { children });
        }

        if (pets !== undefined) {
            query.andWhere('property.allowPets = :pets', { pets });
        }

        return query.getMany();
    }

    async create(property: Partial<Property>): Promise<Property> {
        const newProperty = this.propertyRepository.create(property);
        return this.propertyRepository.save(newProperty);
    }

    async createAmenity(amenity: Partial<Amenity>): Promise<Amenity> {
        const newAmenity = this.amenityRepository.create(amenity);
        return this.amenityRepository.save(newAmenity);
    }

    async createReview(review: Partial<Review>): Promise<Review> {
        const newReview = this.reviewRepository.create(review);
        return this.reviewRepository.save(newReview);
    }

    async createRule(rule: Partial<PropertyRule>): Promise<PropertyRule> {
        const newRule = this.rulesRepository.create(rule);
        return this.rulesRepository.save(newRule);
    }

    async createRuleCategory(category: Partial<RuleCategory>): Promise<RuleCategory> {
        const newCategory = this.ruleCategoriesRepository.create(category);
        return this.ruleCategoriesRepository.save(newCategory);
    }

    async bulkCreateRules(rules: Partial<PropertyRule>[]): Promise<PropertyRule[]> {
        const createdRules = await this.rulesRepository.save(rules);
        return createdRules;
    }

    async deleteRulesByPropertyId(propertyId: number): Promise<void> {
        await this.rulesRepository.delete({ propertyId });
    }

    async deleteAllRules(): Promise<void> {
        await this.rulesRepository.clear();
    }
}
