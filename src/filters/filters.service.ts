import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';
import { Property } from '../entities/property.entity';

@Injectable()
export class FiltersService {
    constructor(
        @InjectRepository(GuestCategory)
        private guestRepository: Repository<GuestCategory>,
        @InjectRepository(SearchDuration)
        private durationRepository: Repository<SearchDuration>,
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
    ) { }

    async getGlobalFilters(): Promise<any> {
        const guestCategories = await this.getGuestCategories();
        
        // Use query builder to get min/max price and unique types
        const priceStats = await this.propertyRepository
            .createQueryBuilder('property')
            .select('MIN(property.price)', 'minPrice')
            .addSelect('MAX(property.price)', 'maxPrice')
            .getRawOne();

        const propertyTypes = await this.propertyRepository
            .createQueryBuilder('property')
            .select('DISTINCT(property.type)', 'type')
            .getRawMany();

        return {
            guestCategories,
            priceRange: {
                min: parseFloat(priceStats.minPrice) || 0,
                max: parseFloat(priceStats.maxPrice) || 500,
            },
            propertyTypes: propertyTypes.map(pt => pt.type),
        };
    }

    getGuestCategories(): Promise<GuestCategory[]> {
        return this.guestRepository.find();
    }

    getSearchDurations(): Promise<SearchDuration[]> {
        return this.durationRepository.find();
    }

    createGuestCategory(data: Partial<GuestCategory>): Promise<GuestCategory> {
        return this.guestRepository.save(data);
    }

    createSearchDuration(data: Partial<SearchDuration>): Promise<SearchDuration> {
        return this.durationRepository.save(data);
    }
}
