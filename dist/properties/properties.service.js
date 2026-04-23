"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("../entities/property.entity");
const amenity_entity_1 = require("../entities/amenity.entity");
const review_entity_1 = require("../entities/review.entity");
const property_rule_entity_1 = require("../entities/property-rule.entity");
const rule_category_entity_1 = require("../entities/rule-category.entity");
let PropertiesService = class PropertiesService {
    propertyRepository;
    amenityRepository;
    reviewRepository;
    rulesRepository;
    ruleCategoriesRepository;
    constructor(propertyRepository, amenityRepository, reviewRepository, rulesRepository, ruleCategoriesRepository) {
        this.propertyRepository = propertyRepository;
        this.amenityRepository = amenityRepository;
        this.reviewRepository = reviewRepository;
        this.rulesRepository = rulesRepository;
        this.ruleCategoriesRepository = ruleCategoriesRepository;
    }
    findAll(categoryId) {
        const query = this.propertyRepository.createQueryBuilder('property')
            .leftJoinAndSelect('property.category', 'category')
            .leftJoinAndSelect('property.images', 'images')
            .leftJoinAndSelect('property.host', 'host')
            .where('property.status IN (:...statuses)', { statuses: ['ACTIVE', 'PUBLISHED'] })
            .andWhere('host.isIdentityVerified = :verified', { verified: true });
        if (categoryId) {
            query.andWhere('category.id = :categoryId', { categoryId });
        }
        return query.getMany();
    }
    async findOne(id) {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['category', 'images', 'amenities', 'reviews', 'reviews.user', 'host'],
        });
        if (property) {
            property.rules = await this.findRules(id);
        }
        return property;
    }
    findAmenities(propertyId) {
        return this.amenityRepository.find({
            where: { propertyId },
        });
    }
    findReviews(propertyId) {
        return this.reviewRepository.find({
            where: { propertyId },
            relations: ['user'],
            order: { reviewDate: 'DESC' },
        });
    }
    async findRules(propertyId) {
        const rules = await this.rulesRepository.find({
            where: { propertyId },
            order: { categoryName: 'ASC', sortOrder: 'ASC' },
        });
        return rules;
    }
    async findRuleCategories() {
        return this.ruleCategoriesRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }
    async search(params) {
        const { location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children, infants, pets } = params;
        const query = this.propertyRepository.createQueryBuilder('property');
        if (location && location.trim() !== '' && !location.includes('Search destinations')) {
            const keyword = location.split(/[, ]+/)[0];
            query.andWhere('property.location LIKE :keyword', { keyword: `%${keyword}%` });
        }
        if (startDate && startDate !== 'Add dates') {
            try {
                const sDate = new Date(startDate);
                if (!isNaN(sDate.getTime())) {
                    query.andWhere('(property.availableFrom IS NULL OR property.availableFrom <= :sDate)', { sDate });
                    if (endDate && endDate !== 'Add dates') {
                        const eDate = new Date(endDate);
                        if (!isNaN(eDate.getTime())) {
                            query.andWhere('(property.availableTo IS NULL OR property.availableTo >= :eDate)', { eDate });
                        }
                    }
                }
            }
            catch (e) {
                console.error('[ERROR] Parsing dates in property search:', e);
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
            const monthMap = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const conditions = flexibleMonths.map((m, i) => {
                const monthIdx = monthMap[m];
                const startOfMonth = new Date(2026, monthIdx, 1);
                const endOfMonth = new Date(2026, monthIdx + 1, 0);
                return `(property.availableFrom <= :eom${i} AND property.availableTo >= :som${i})`;
            }).join(' OR ');
            const parameters = {};
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
        query.leftJoinAndSelect('property.category', 'category')
            .leftJoinAndSelect('property.images', 'images')
            .leftJoinAndSelect('property.host', 'host')
            .andWhere('property.status = :status', { status: 'ACTIVE' })
            .andWhere('host.isIdentityVerified = :verified', { verified: true });
        return query.getMany();
    }
    async create(property) {
        const newProperty = this.propertyRepository.create(property);
        return this.propertyRepository.save(newProperty);
    }
    async createAmenity(amenity) {
        const newAmenity = this.amenityRepository.create(amenity);
        return this.amenityRepository.save(newAmenity);
    }
    async createReview(review) {
        const newReview = this.reviewRepository.create(review);
        return this.reviewRepository.save(newReview);
    }
    async createRule(rule) {
        const newRule = this.rulesRepository.create(rule);
        return this.rulesRepository.save(newRule);
    }
    async createRuleCategory(category) {
        const newCategory = this.ruleCategoriesRepository.create(category);
        return this.ruleCategoriesRepository.save(newCategory);
    }
    async bulkCreateRules(rules) {
        const createdRules = await this.rulesRepository.save(rules);
        return createdRules;
    }
    async deleteRulesByPropertyId(propertyId) {
        await this.rulesRepository.delete({ propertyId });
    }
    async deleteAllRules() {
        await this.rulesRepository.clear();
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(amenity_entity_1.Amenity)),
    __param(2, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(3, (0, typeorm_1.InjectRepository)(property_rule_entity_1.PropertyRule)),
    __param(4, (0, typeorm_1.InjectRepository)(rule_category_entity_1.RuleCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map