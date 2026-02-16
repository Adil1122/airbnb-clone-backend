import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
export declare class PropertiesService {
    private propertyRepository;
    constructor(propertyRepository: Repository<Property>);
    findAll(categoryId?: number): Promise<Property[]>;
    findOne(id: number): Promise<Property | null>;
    create(property: Partial<Property>): Promise<Property>;
}
