import { ExperiencesService } from './experiences.service';
import { Experience } from '../entities/experience.entity';
export declare class ExperiencesController {
    private readonly experiencesService;
    constructor(experiencesService: ExperiencesService);
    findAll(): Promise<Experience[]>;
    search(location?: string, startDate?: string, endDate?: string, monthsCount?: string, flexibleType?: string, flexibleMonths?: string, adults?: string, children?: string): Promise<Experience[]>;
}
