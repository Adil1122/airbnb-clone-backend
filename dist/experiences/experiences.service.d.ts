import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
export declare class ExperiencesService {
    private experiencesRepository;
    constructor(experiencesRepository: Repository<Experience>);
    findAll(): Promise<Experience[]>;
    search(params: {
        location?: string;
        startDate?: string;
        endDate?: string;
        monthsCount?: number;
        flexibleType?: string;
        flexibleMonths?: string[];
        adults?: number;
        children?: number;
    }): Promise<Experience[]>;
    findOne(id: number): Promise<Experience | null>;
    create(experience: Partial<Experience>): Promise<Experience>;
}
