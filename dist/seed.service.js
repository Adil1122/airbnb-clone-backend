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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("./categories/categories.service");
const properties_service_1 = require("./properties/properties.service");
let SeedService = class SeedService {
    categoriesService;
    propertiesService;
    constructor(categoriesService, propertiesService) {
        this.categoriesService = categoriesService;
        this.propertiesService = propertiesService;
    }
    async onModuleInit() {
        const categories = await this.categoriesService.findAll();
        if (categories.length === 0) {
            await this.seed();
        }
    }
    async seed() {
        const categoryData = [
            { label: 'Trending', iconName: 'Flame', slug: 'trending' },
            { label: 'Beachfront', iconName: 'Palmtree', slug: 'beach' },
            { label: 'Lakes', iconName: 'Waves', slug: 'lakes' },
            { label: 'Mountains', iconName: 'Mountain', slug: 'mountains' },
            { label: 'Castles', iconName: 'Castle', slug: 'castles' },
            { label: 'Arctic', iconName: 'Snowflake', slug: 'arctic' },
            { label: 'Camping', iconName: 'Tent', slug: 'camping' },
            { label: 'Islands', iconName: 'Wind', slug: 'islands' },
            { label: 'B&Bs', iconName: 'Coffee', slug: 'breakfast' },
            { label: 'Boats', iconName: 'Ship', slug: 'boats' },
        ];
        const createdCategories = [];
        for (const cat of categoryData) {
            const created = await this.categoriesService.create(cat);
            createdCategories.push(created);
        }
        const trendingCat = createdCategories.find((c) => c.slug === 'trending');
        const beachCat = createdCategories.find((c) => c.slug === 'beach');
        const mountainCat = createdCategories.find((c) => c.slug === 'mountains');
        const propertyData = [
            {
                title: 'The Glass House Oasis',
                location: 'Malibu, California',
                price: 850,
                rating: 4.98,
                imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                status: 'Verified',
                type: 'Luxury Villa',
                category: trendingCat,
            },
            {
                title: 'Azure Beach Villa',
                location: 'Santorini, Greece',
                price: 950,
                rating: 4.99,
                imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
                status: 'Verified',
                type: 'Beach House',
                category: beachCat,
            },
            {
                title: 'Peak View Cabin',
                location: 'Zermatt, Switzerland',
                price: 550,
                rating: 4.88,
                imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
                status: 'Elite',
                type: 'Mountain Lodge',
                category: mountainCat,
            },
            {
                title: 'Industrial Heights Loft',
                location: 'Berlin, Germany',
                price: 320,
                rating: 4.85,
                imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                status: 'Elite',
                type: 'Design Studio',
                category: trendingCat,
            },
            {
                title: 'Redwood Sanctuary',
                location: 'Aspen, USA',
                price: 450,
                rating: 4.92,
                imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
                status: 'Featured',
                type: 'Nature Retreat',
                category: trendingCat,
            },
            {
                title: 'Infinite Blue Suite',
                location: 'Oia, Greece',
                price: 600,
                rating: 4.95,
                imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
                status: 'Verified',
                type: 'Island Haven',
                category: trendingCat,
            },
            {
                title: 'Shadow Desert Manor',
                location: 'Joshua Tree, USA',
                price: 275,
                rating: 4.78,
                imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
                status: 'New',
                type: 'Architectural Gem',
                category: trendingCat,
            },
            {
                title: 'Banyan Tree Loft',
                location: 'Ubud, Bali',
                price: 150,
                rating: 4.89,
                imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
                status: 'Eco-Pro',
                type: 'Tropical Hideaway',
                category: trendingCat,
            },
        ];
        for (const prop of propertyData) {
            await this.propertiesService.create(prop);
        }
        console.log('Seeding complete!');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        properties_service_1.PropertiesService])
], SeedService);
//# sourceMappingURL=seed.service.js.map