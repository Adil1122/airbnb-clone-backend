import { Repository } from 'typeorm';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';
export declare class FiltersService {
    private guestRepository;
    private durationRepository;
    constructor(guestRepository: Repository<GuestCategory>, durationRepository: Repository<SearchDuration>);
    getGuestCategories(): Promise<GuestCategory[]>;
    getSearchDurations(): Promise<SearchDuration[]>;
    createGuestCategory(data: Partial<GuestCategory>): Promise<GuestCategory>;
    createSearchDuration(data: Partial<SearchDuration>): Promise<SearchDuration>;
}
