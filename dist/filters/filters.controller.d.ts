import { FiltersService } from './filters.service';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';
export declare class FiltersController {
    private readonly filtersService;
    constructor(filtersService: FiltersService);
    getGuestCategories(): Promise<GuestCategory[]>;
    getSearchDurations(): Promise<SearchDuration[]>;
}
