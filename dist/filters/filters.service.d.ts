import { Repository } from 'typeorm';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';
import { Property } from '../entities/property.entity';
export declare class FiltersService {
    private guestRepository;
    private durationRepository;
    private propertyRepository;
    constructor(guestRepository: Repository<GuestCategory>, durationRepository: Repository<SearchDuration>, propertyRepository: Repository<Property>);
    getGlobalFilters(): Promise<any>;
    getGuestCategories(): Promise<GuestCategory[]>;
    getSearchDurations(): Promise<SearchDuration[]>;
    createGuestCategory(data: Partial<GuestCategory>): Promise<GuestCategory>;
    createSearchDuration(data: Partial<SearchDuration>): Promise<SearchDuration>;
}
