import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuestCategory, SearchDuration } from '../entities/filter-options.entity';

@Injectable()
export class FiltersService {
    constructor(
        @InjectRepository(GuestCategory)
        private guestRepository: Repository<GuestCategory>,
        @InjectRepository(SearchDuration)
        private durationRepository: Repository<SearchDuration>,
    ) { }

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
