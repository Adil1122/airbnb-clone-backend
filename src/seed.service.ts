import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories/categories.service';
import { PropertiesService } from './properties/properties.service';
import { ExperiencesService } from './experiences/experiences.service';
import { ServicesService } from './services/services.service';
import { DestinationsService } from './destinations/destinations.service';
import { FiltersService } from './filters/filters.service';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly propertiesService: PropertiesService,
        private readonly experiencesService: ExperiencesService,
        private readonly servicesService: ServicesService,
        private readonly destinationsService: DestinationsService,
        private readonly filtersService: FiltersService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.checkAndSeed();
    }

    private async seedUsers(): Promise<User[]> {
        const usersData = [
            {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@example.com',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Michael Chen',
                email: 'michael.chen@example.com',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@example.com',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'David Kim',
                email: 'david.kim@example.com',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Jessica Thompson',
                email: 'jessica.thompson@example.com',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Robert Martinez',
                email: 'robert.martinez@example.com',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Amanda Wilson',
                email: 'amanda.wilson@example.com',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'James Brown',
                email: 'james.brown@example.com',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Lisa Anderson',
                email: 'lisa.anderson@example.com',
                avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=150',
            },
            {
                name: 'Chris Taylor',
                email: 'chris.taylor@example.com',
                avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
            },
        ];

        const users: User[] = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (const userData of usersData) {
            let user = await this.userRepository.findOne({ where: { email: userData.email } });
            if (!user) {
                user = this.userRepository.create({
                    ...userData,
                    password: hashedPassword,
                    isEmailVerified: true,
                    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 3),
                });
                await this.userRepository.save(user);
            }
            users.push(user);
        }

        return users;
    }

    async checkAndSeed() {
        const users = await this.seedUsers();

        const categories = await this.categoriesService.findAll();
        if (categories.length === 0) {
            await this.seedCategories();
        }

        const freshCategories = await this.categoriesService.findAll();

        await this.seedRuleCategories();

        const properties = await this.propertiesService.findAll();
        if (properties.length < 50) {
            await this.seedProperties(freshCategories);
        } else {
            for (const prop of properties) {
                const amenities = await this.propertiesService.findAmenities(prop.id);
                if (amenities.length === 0) {
                    await this.seedAmenitiesForProperty(prop.id);
                }
            }
        }

        const freshProperties = await this.propertiesService.findAll();
        console.log(`Seeding data for ${freshProperties.length} properties...`);
        
        for (const prop of freshProperties) {
            const reviews = await this.propertiesService.findReviews(prop.id);
            if (reviews.length === 0) {
                await this.seedReviewsForProperty(prop.id, users);
            }

            await this.propertiesService.deleteRulesByPropertyId(prop.id);
            await this.seedRulesForProperty(prop.id, prop.maxAdults);
            const rules = await this.propertiesService.findRules(prop.id);
            console.log(`Property ${prop.id}: seeded ${rules.length} rules`);
        }

        const experiences = await this.experiencesService.findAll();
        if (experiences.length === 0) {
            await this.seedExperiences();
        }

        const services = await this.servicesService.findAll();
        if (services.length === 0) {
            await this.seedServices();
        }

        const destinations = await this.destinationsService.findAll();
        if (destinations.length === 0) {
            await this.seedDestinations();
        }

        const guestCats = await this.filtersService.getGuestCategories();
        if (guestCats.length === 0) {
            await this.seedGuestCategories();
        }

        const durations = await this.filtersService.getSearchDurations();
        if (durations.length === 0) {
            await this.seedSearchDurations();
        }

        console.log('Seeding check complete!');
    }

    async seedAmenitiesForProperty(propertyId: number) {
        const amenitiesList = [
            { name: 'Wifi', icon: 'Wifi' },
            { name: 'TV', icon: 'Tv' },
            { name: 'Free parking', icon: 'Car' },
            { name: 'Kitchen', icon: 'UtensilsCrossed' },
            { name: 'Air conditioning', icon: 'Wind' },
            { name: 'Washer', icon: 'Droplets' },
            { name: 'Pool', icon: 'Waves' },
            { name: 'Hot tub', icon: 'Flame' },
            { name: 'Gym', icon: 'Dumbbell' },
            { name: 'Breakfast', icon: 'Coffee' },
            { name: 'Hair dryer', icon: 'Wind' },
            { name: 'Smoke alarm', icon: 'AlertCircle' },
        ];

        for (const amenity of amenitiesList) {
            await this.propertiesService.createAmenity({
                ...amenity,
                propertyId,
            });
        }
    }

    async seedGuestCategories() {
        const guestData = [
            { label: 'Adults', sublabel: 'Ages 13 or above', type: 'adults' },
            { label: 'Children', sublabel: 'Ages 2 – 12', type: 'children' },
            { label: 'Infants', sublabel: 'Under 2', type: 'infants' },
            { label: 'Pets', sublabel: 'Bringing a service animal?', type: 'pets' },
        ];
        for (const g of guestData) {
            await this.filtersService.createGuestCategory(g);
        }
    }

    async seedSearchDurations() {
        const durationData = [
            { label: 'Weekend', value: 'weekend' },
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
        ];
        for (const d of durationData) {
            await this.filtersService.createSearchDuration(d);
        }
    }

    async seedDestinations() {
        const destinationData = [
            { name: 'Bangkok', region: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Phuket', region: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Chiang Mai', region: 'Thailand', imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Dubai', region: 'United Arab Emirates', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Paris', region: 'France', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'New York', region: 'United States', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Tokyo', region: 'Japan', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'London', region: 'United Kingdom', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Barcelona', region: 'Spain', imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=100&q=80', type: 'city' },
            { name: 'Bali', region: 'Indonesia', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=100&q=80', type: 'city' },

            { name: "I'm flexible", region: '', imageUrl: '', type: 'region' },
            { name: 'Europe', region: '', imageUrl: '', type: 'region' },
            { name: 'Southeast Asia', region: '', imageUrl: '', type: 'region' },
            { name: 'United States', region: '', imageUrl: '', type: 'region' },
            { name: 'Middle East', region: '', imageUrl: '', type: 'region' },
            { name: 'Asia Pacific', region: '', imageUrl: '', type: 'region' },
        ];

        for (const dest of destinationData) {
            await this.destinationsService.create(dest);
        }
    }

    async seedCategories() {
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

        for (const cat of categoryData) {
            await this.categoriesService.create(cat);
        }
    }

    async seedProperties(categories: Category[]) {
        const basePropertyData: any[] = [
            {
                title: 'Modern Villa with Pool',
                location: 'Bangkok, Thailand',
                price: 150,
                rating: 4.9,
                reviewCount: 156,
                imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
                status: 'Available',
                type: 'Villa',
                category: categories[1],
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 4,
                maxChildren: 2,
                maxInfants: 1,
                bedrooms: 2,
                beds: 3,
                bathrooms: 2,
                kitchens: 1,
                allowPets: true,
                hostName: 'Pichaya',
                hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
                hostBio: 'Passionate about hospitality and creating memorable experiences.',
                hostSince: '2019',
                description: 'Welcome to our lovely 2-bedroom villa in Bangkok! Perfect for families, this space is located just minutes away from the BTS station.\n\nThe villa features a spacious living area, a fully equipped kitchen, and a private pool for your enjoyment.',
                hasGreatLocation: true,
                greatLocationDesc: '100% of recent guests gave the location a 5-star rating.',
                hasFastWifi: true,
                fastWifiDesc: 'At 250 Mbps, you can take video calls and stream videos.',
                hasGuestFavorite: true,
                guestFavoriteDesc: 'One of the most loved homes on Airbnb based on ratings and reviews.',
                images: [
                    { category: 'Living Room', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Full kitchen', url: 'https://images.unsplash.com/photo-1556911220-e152748a7f83?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bedroom 1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a2d0?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bathroom 1', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
                ]
            },
            {
                title: 'Cozy Farmhouse',
                location: 'Chiang Mai, Thailand',
                price: 80,
                rating: 4.8,
                reviewCount: 89,
                imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
                status: 'Available',
                type: 'Farmhouse',
                category: categories[2],
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 6,
                maxChildren: 4,
                maxInfants: 2,
                bedrooms: 3,
                beds: 4,
                bathrooms: 2,
                kitchens: 1,
                allowPets: true,
                hostName: 'Somchai',
                hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
                hostBio: 'Local farmer who loves sharing authentic Thai countryside living.',
                hostSince: '2020',
                description: 'Experience authentic Thai countryside life in our cozy farmhouse. Surrounded by rice fields and nature, this is the perfect retreat.\n\nFeatures traditional architecture with modern amenities and a beautiful garden.',
                hasGreatLocation: true,
                greatLocationDesc: '100% of recent guests loved the peaceful location.',
                hasFastWifi: false,
                fastWifiDesc: '',
                hasGuestFavorite: false,
                guestFavoriteDesc: '',
                images: [
                    { category: 'Living Room', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Full kitchen', url: 'https://images.unsplash.com/photo-1556911220-e152748a7f83?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bedroom 1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a2d0?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bathroom 1', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            {
                title: 'Historic Castle Stay',
                location: 'Edinburgh, UK',
                price: 450,
                rating: 4.95,
                reviewCount: 203,
                imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=800&q=80',
                status: 'Available',
                type: 'Castle',
                category: categories[4],
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 10,
                maxChildren: 5,
                maxInfants: 3,
                bedrooms: 5,
                beds: 6,
                bathrooms: 4,
                kitchens: 2,
                allowPets: false,
                hostName: 'William',
                hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
                hostBio: 'History enthusiast and castle preservation advocate.',
                hostSince: '2017',
                description: 'Live like royalty in this stunning 5-bedroom castle. Original medieval architecture with modern luxury amenities.\n\nFeatures grand halls, a gourmet kitchen, and breathtaking views of the Scottish Highlands.',
                hasGreatLocation: true,
                greatLocationDesc: 'Perfect location in the heart of historic Edinburgh.',
                hasFastWifi: true,
                fastWifiDesc: 'At 300 Mbps, ultra-fast connection throughout the castle.',
                hasGuestFavorite: true,
                guestFavoriteDesc: 'Consistently rated as an exceptional property.',
                images: [
                    { category: 'Living Room', url: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bedroom 1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a2d0?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bathroom 1', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            {
                title: 'Beachfront Bungalow',
                location: 'Phuket, Thailand',
                price: 200,
                rating: 4.7,
                reviewCount: 124,
                imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
                status: 'Available',
                type: 'Bungalow',
                category: categories[1],
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 2,
                maxChildren: 1,
                maxInfants: 0,
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                kitchens: 1,
                allowPets: true,
                hostName: 'Anong',
                hostImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
                hostBio: 'Beach lover and water sports enthusiast.',
                hostSince: '2021',
                description: 'Wake up to stunning ocean views in this beachfront bungalow. Steps from the sand, perfect for couples.\n\nEnjoy sunrise views and easy access to the best beaches in Phuket.',
                hasGreatLocation: true,
                greatLocationDesc: 'Direct beach access with stunning sunset views.',
                hasFastWifi: true,
                fastWifiDesc: 'At 100 Mbps for work and streaming.',
                hasGuestFavorite: false,
                guestFavoriteDesc: '',
                images: [
                    { category: 'Living Room', url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Bedroom 1', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a2d0?auto=format&fit=crop&w=800&q=80' }
                ]
            },
            {
                title: 'Mountain Retreat Cabin',
                location: 'Swiss Alps, Switzerland',
                price: 300,
                rating: 4.85,
                reviewCount: 78,
                imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
                status: 'Available',
                type: 'Cabin',
                category: categories[3],
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 4,
                maxChildren: 2,
                maxInfants: 1,
                bedrooms: 2,
                beds: 3,
                bathrooms: 1,
                kitchens: 1,
                allowPets: false,
                hostName: 'Hans',
                hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
                hostBio: 'Swiss mountain guide and ski instructor.',
                hostSince: '2019',
                description: 'Escape to the Swiss Alps in this cozy mountain cabin. Perfect for ski season or summer hikes.\n\nFeatures traditional Swiss design, a wood-burning fireplace, and panoramic mountain views.',
                hasGreatLocation: true,
                greatLocationDesc: 'Ski-in/ski-out access to world-class slopes.',
                hasFastWifi: true,
                fastWifiDesc: 'At 150 Mbps for staying connected.',
                hasGuestFavorite: false,
                guestFavoriteDesc: '',
                images: [
                    { category: 'Living Room', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
                    { category: 'Full kitchen', url: 'https://images.unsplash.com/photo-1556911220-e152748a7f83?auto=format&fit=crop&w=800&q=80' }
                ]
            },
        ];

        const amenitiesList = [
            { name: 'Wifi', icon: 'Wifi' },
            { name: 'TV', icon: 'Tv' },
            { name: 'Free parking', icon: 'Car' },
            { name: 'Kitchen', icon: 'UtensilsCrossed' },
            { name: 'Air conditioning', icon: 'Wind' },
            { name: 'Washer', icon: 'Droplets' },
            { name: 'Pool', icon: 'Waves' },
            { name: 'Hot tub', icon: 'Flame' },
            { name: 'Gym', icon: 'Dumbbell' },
            { name: 'Breakfast', icon: 'Coffee' },
            { name: 'Hair dryer', icon: 'Wind' },
            { name: 'Smoke alarm', icon: 'AlertCircle' },
        ];

        // Replicate to 50 items
        for (let i = 0; i < 10; i++) {
            for (const prop of basePropertyData) {
                const created = await this.propertiesService.create(prop);
                
                // Add amenities
                for (const amenity of amenitiesList) {
                    await this.propertiesService.createAmenity({
                        ...amenity,
                        propertyId: created.id,
                    });
                }
            }
        }
    }

    async seedExperiences() {
        const baseExperienceData = [
            {
                title: 'Dubai Desert Safari Adventure',
                location: 'Dubai, UAE',
                price: 89,
                rating: 4.92,
                imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80',
                reviews: 234,
                category: 'Adventure',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 4,
                maxChildren: 2,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Tuscan Wine Tasting Tour',
                location: 'Florence, Italy',
                price: 125,
                rating: 4.98,
                imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
                reviews: 456,
                category: 'Food & Drink',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 20,
                maxChildren: 0,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Tokyo Hidden Food Market Walk',
                location: 'Tokyo, Japan',
                price: 75,
                rating: 4.95,
                imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
                reviews: 189,
                category: 'Food & Drink',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 10,
                maxChildren: 5,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Paris Art & Architecture Walk',
                location: 'Paris, France',
                price: 65,
                rating: 4.88,
                imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
                reviews: 312,
                category: 'Culture',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 15,
                maxChildren: 10,
                maxInfants: 5,
                allowPets: false,
            },
            {
                title: 'Bali Jungle Trek & Waterfall',
                location: 'Bali, Indonesia',
                price: 55,
                rating: 4.91,
                imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
                reviews: 567,
                category: 'Nature',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 8,
                maxChildren: 4,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Barcelona Cooking Class',
                location: 'Barcelona, Spain',
                price: 95,
                rating: 4.97,
                imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
                reviews: 278,
                category: 'Food & Drink',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 12,
                maxChildren: 6,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'New York Jazz Club Night',
                location: 'New York, USA',
                price: 85,
                rating: 4.85,
                imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80',
                reviews: 423,
                category: 'Entertainment',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 50,
                maxChildren: 0,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Santorini Sunset Sailing',
                location: 'Santorini, Greece',
                price: 145,
                rating: 4.99,
                imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
                reviews: 389,
                category: 'Boat Tour',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 10,
                maxChildren: 2,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Marrakech Medina Food Tour',
                location: 'Marrakech, Morocco',
                price: 68,
                rating: 4.93,
                imageUrl: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
                reviews: 198,
                category: 'Food & Drink',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 15,
                maxChildren: 5,
                maxInfants: 2,
                allowPets: false,
            },
            {
                title: 'Sydney Harbour Kayaking',
                location: 'Sydney, Australia',
                price: 79,
                rating: 4.86,
                imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
                reviews: 156,
                category: 'Adventure',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 6,
                maxChildren: 2,
                maxInfants: 0,
                allowPets: false,
            }
        ];

        for (let i = 0; i < 5; i++) {
            for (const exp of baseExperienceData) {
                await this.experiencesService.create(exp);
            }
        }
    }

    async seedServices() {
        const baseServiceData = [
            {
                title: 'Private Chef for Dinner Party',
                location: 'Los Angeles, United States',
                price: 350,
                rating: 4.97,
                imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
                category: 'Chef',
                duration: '4 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 20,
                maxChildren: 10,
                maxInfants: 5,
                allowPets: false,
            },
            {
                title: 'Professional Photo Shoot',
                location: 'New York, United States',
                price: 275,
                rating: 4.92,
                imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
                category: 'Photography',
                duration: '2 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 5,
                maxChildren: 2,
                maxInfants: 1,
                allowPets: true,
            },
            {
                title: 'Relaxing Swedish Massage',
                location: 'Miami, United States',
                price: 120,
                rating: 4.98,
                imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
                category: 'Wellness',
                duration: '60 min',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 2,
                maxChildren: 0,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Live Jazz Band Performance',
                location: 'New Orleans, United States',
                price: 500,
                rating: 4.95,
                imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
                category: 'Entertainment',
                duration: '3 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 100,
                maxChildren: 0,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Yoga Instructor Session',
                location: 'San Diego, United States',
                price: 85,
                rating: 4.89,
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
                category: 'Fitness',
                duration: '60 min',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 20,
                maxChildren: 5,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Personal Driver & Tour Guide',
                location: 'San Francisco, United States',
                price: 200,
                rating: 4.91,
                imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
                category: 'Transportation',
                duration: '8 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 4,
                maxChildren: 2,
                maxInfants: 1,
                allowPets: false,
            },
            {
                title: 'Floral Arrangement Workshop',
                location: 'Seattle, United States',
                price: 95,
                rating: 4.87,
                imageUrl: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=80',
                category: 'Art',
                duration: '2 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 10,
                maxChildren: 5,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Mixology Cocktail Class',
                location: 'Chicago, United States',
                price: 110,
                rating: 4.94,
                imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
                category: 'Entertainment',
                duration: '2 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 15,
                maxChildren: 0,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Spa & Wellness Package',
                location: 'Austin, United States',
                price: 180,
                rating: 4.96,
                imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
                category: 'Wellness',
                duration: '3 hours',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 4,
                maxChildren: 0,
                maxInfants: 0,
                allowPets: false,
            },
            {
                title: 'Portrait Drawing by Artist',
                location: 'Denver, United States',
                price: 150,
                rating: 4.88,
                imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80',
                category: 'Art',
                duration: '90 min',
                availableFrom: new Date('2026-03-01'),
                availableTo: new Date('2026-12-31'),
                maxAdults: 2,
                maxChildren: 1,
                maxInfants: 0,
                allowPets: false,
            }
        ];

        for (let i = 0; i < 5; i++) {
            for (const serv of baseServiceData) {
                await this.servicesService.create(serv);
            }
        }
    }

    async seedReviewsForProperty(propertyId: number, users: User[]) {
        const reviewsData = [
            {
                reviewText: 'Absolutely loved our stay! The place was even better than the photos. The host was incredibly responsive and the location was perfect. Would definitely book again!',
                rating: 5,
                reviewDate: '2026-02-15',
            },
            {
                reviewText: 'Great experience overall. The space was clean and well-maintained. Only minor issue was slight noise from the street, but nothing that ruined our stay.',
                rating: 4,
                reviewDate: '2026-02-01',
            },
            {
                reviewText: 'This place exceeded all expectations. The amenities were top-notch and the view was breathtaking. Perfect for a romantic getaway.',
                rating: 5,
                reviewDate: '2026-01-20',
            },
            {
                reviewText: 'Good value for money. The apartment had everything we needed and was in a great neighborhood with easy access to public transport.',
                rating: 4,
                reviewDate: '2026-01-05',
            },
            {
                reviewText: 'The check-in process was seamless and the host provided excellent recommendations for local restaurants. Highly recommend!',
                rating: 5,
                reviewDate: '2025-12-18',
            },
            {
                reviewText: 'Spacious and comfortable. Perfect for our family vacation. The kids loved the neighborhood and we felt very safe.',
                rating: 5,
                reviewDate: '2025-12-02',
            }
        ];

        for (let i = 0; i < reviewsData.length; i++) {
            const review = reviewsData[i];
            const user = users[i % users.length];
            await this.propertiesService.createReview({
                ...review,
                propertyId,
                userId: user.id,
            });
        }
    }

    async seedRuleCategories() {
        const categories = [
            { name: 'House rules', icon: 'Home', sortOrder: 1 },
            { name: 'Safety & property', icon: 'Shield', sortOrder: 2 },
            { name: 'Cancellation policy', icon: 'Calendar', sortOrder: 3 },
            { name: 'Getting around', icon: 'Car', sortOrder: 4 },
            { name: 'Policies', icon: 'FileText', sortOrder: 5 },
        ];

        for (const cat of categories) {
            const existing = await this.propertiesService.findRuleCategories().then(cats => cats.find(c => c.name === cat.name));
            if (!existing) {
                await this.propertiesService.createRuleCategory(cat);
            }
        }
    }

    async seedRulesForProperty(propertyId: number, maxGuests: number) {
        const categories = await this.propertiesService.findRuleCategories();
        
        if (categories.length === 0) {
            await this.seedRuleCategories();
        }
        
        const freshCategories = await this.propertiesService.findRuleCategories();
        const categoryMap = new Map(freshCategories.map(c => [c.name, c]));
        
        const rulesToCreate: any[] = [];
        const checkInTime = ['3:00 PM', '4:00 PM', '2:00 PM', '5:00 PM'][Math.floor(Math.random() * 4)];
        const checkoutTime = ['11:00 AM', '10:00 AM', '12:00 PM', '9:00 AM'][Math.floor(Math.random() * 4)];
        const allowSmoking = Math.random() > 0.7;
        const allowPets = Math.random() > 0.5;
        const allowParties = Math.random() > 0.8;
        const hasPool = Math.random() > 0.6;
        const cancellationPolicies = [
            { name: 'Flexible', desc: 'Cancel before check-in for a full refund, minus the service fee.' },
            { name: 'Moderate', desc: 'Cancel 5 days before check-in for a full refund. After that, the first night is non-refundable.' },
            { name: 'Strict', desc: 'Cancel 30 days before check-in for a 50% refund. No refund after that.' },
        ];
        const cancelPolicy = cancellationPolicies[Math.floor(Math.random() * cancellationPolicies.length)];

        const houseRulesCat = categoryMap.get('House rules');
        if (houseRulesCat) {
            rulesToCreate.push(
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: `Check-in after ${checkInTime}`, displayType: 'icon_text', sortOrder: 1 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: `Checkout before ${checkoutTime}`, displayType: 'icon_text', sortOrder: 2 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: `${maxGuests} guests maximum`, displayType: 'icon_text', sortOrder: 3 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: allowSmoking ? 'Smoking allowed' : 'No smoking', isPositive: allowSmoking, displayType: 'checkbox', sortOrder: 4 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: allowPets ? 'Pets allowed' : 'No pets', isPositive: allowPets, displayType: 'checkbox', sortOrder: 5 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: allowParties ? 'Parties allowed' : 'No parties or events', isPositive: allowParties, displayType: 'checkbox', sortOrder: 6 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: 'Suitable for children (2-12 years)', isPositive: true, displayType: 'checkbox', sortOrder: 7 },
                { propertyId, categoryId: houseRulesCat.id, categoryName: 'House rules', categoryIcon: 'Home', title: 'Suitable for infants', isPositive: true, displayType: 'checkbox', sortOrder: 8 },
            );
        }

        const safetyCat = categoryMap.get('Safety & property');
        if (safetyCat) {
            rulesToCreate.push(
                { propertyId, categoryId: safetyCat.id, categoryName: 'Safety & property', categoryIcon: 'Shield', title: 'Smoke alarm', description: 'Smoke alarm is present and functional', isPositive: true, displayType: 'checkbox', sortOrder: 1 },
                { propertyId, categoryId: safetyCat.id, categoryName: 'Safety & property', categoryIcon: 'Shield', title: 'Carbon monoxide alarm', description: 'Carbon monoxide alarm is present', isPositive: true, displayType: 'checkbox', sortOrder: 2 },
                { propertyId, categoryId: safetyCat.id, categoryName: 'Safety & property', categoryIcon: 'Shield', title: 'Security camera(s)', description: 'Recording devices may be present on the property', isPositive: true, displayType: 'checkbox', sortOrder: 3 },
                { propertyId, categoryId: safetyCat.id, categoryName: 'Safety & property', categoryIcon: 'Shield', title: 'Pool', description: hasPool ? 'Property has a pool available for guest use' : 'No pool on property', isPositive: hasPool, displayType: 'checkbox', sortOrder: 4 },
            );
        }

        const cancelCat = categoryMap.get('Cancellation policy');
        if (cancelCat) {
            rulesToCreate.push(
                { propertyId, categoryId: cancelCat.id, categoryName: 'Cancellation policy', categoryIcon: 'Calendar', title: cancelPolicy.name, description: cancelPolicy.desc, isPositive: true, displayType: 'text_only', sortOrder: 1 },
                { propertyId, categoryId: cancelCat.id, categoryName: 'Cancellation policy', categoryIcon: 'Calendar', title: 'Check-in starts at', description: checkInTime, isPositive: true, displayType: 'text_only', sortOrder: 2 },
            );
        }

        const gettingAroundCat = categoryMap.get('Getting around');
        if (gettingAroundCat) {
            rulesToCreate.push(
                { propertyId, categoryId: gettingAroundCat.id, categoryName: 'Getting around', categoryIcon: 'Car', title: 'Free parking on premises', description: 'Private parking available on site at no extra cost', isPositive: true, displayType: 'checkbox', sortOrder: 1 },
                { propertyId, categoryId: gettingAroundCat.id, categoryName: 'Getting around', categoryIcon: 'Car', title: 'Public transport nearby', description: 'BTS Skytrain station within 10 minutes walking distance', isPositive: true, displayType: 'checkbox', sortOrder: 2 },
            );
        }

        if (rulesToCreate.length > 0) {
            await this.propertiesService.bulkCreateRules(rulesToCreate);
        }
    }
}
