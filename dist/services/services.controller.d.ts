import { ServicesService } from './services.service';
import { Service } from '../entities/service.entity';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(): Promise<Service[]>;
    search(location?: string, startDate?: string, endDate?: string, monthsCount?: string, flexibleType?: string, flexibleMonths?: string, adults?: string, children?: string): Promise<Service[]>;
    findOne(id: number): Promise<Service | null>;
}
