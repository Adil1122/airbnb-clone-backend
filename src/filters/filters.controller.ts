import { Controller, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';

@Controller('filters')
export class FiltersController {
    constructor(private readonly filtersService: FiltersService) { }

    @Get()
    getGlobalFilters(): Promise<any> {
        return this.filtersService.getGlobalFilters();
    }

    @Get('guest-categories')
    getGuestCategories(): Promise<GuestCategory[]> {
        return this.filtersService.getGuestCategories();
    }

    @Get('search-durations')
    getSearchDurations(): Promise<SearchDuration[]> {
        return this.filtersService.getSearchDurations();
    }
}
