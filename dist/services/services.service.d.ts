import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
export declare class ServicesService {
    private servicesRepository;
    constructor(servicesRepository: Repository<Service>);
    findAll(): Promise<Service[]>;
    findAllCategories(): Promise<string[]>;
    search(params: {
        location?: string;
        startDate?: string;
        endDate?: string;
        monthsCount?: number;
        flexibleType?: string;
        flexibleMonths?: string[];
        adults?: number;
        children?: number;
        category?: string;
    }): Promise<Service[]>;
    findOne(id: number): Promise<Service | null>;
    create(service: Partial<Service>): Promise<Service>;
}
