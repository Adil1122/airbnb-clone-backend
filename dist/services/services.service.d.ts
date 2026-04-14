import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
export declare class ServicesService {
    private servicesRepository;
    constructor(servicesRepository: Repository<Service>);
    findAll(): Promise<Service[]>;
    search(params: {
        location?: string;
        startDate?: string;
        endDate?: string;
        monthsCount?: number;
        flexibleType?: string;
        flexibleMonths?: string[];
        adults?: number;
        children?: number;
    }): Promise<Service[]>;
    create(service: Partial<Service>): Promise<Service>;
}
