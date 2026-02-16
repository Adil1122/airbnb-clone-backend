import { PropertiesService } from './properties.service';
import { Property } from '../entities/property.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(categoryId?: string): Promise<Property[]>;
    findOne(id: number): Promise<Property | null>;
}
