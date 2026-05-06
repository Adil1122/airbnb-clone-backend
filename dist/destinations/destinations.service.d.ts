import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { Property } from '../entities/property.entity';
export declare class DestinationsService {
    private destinationsRepository;
    private propertyRepository;
    constructor(destinationsRepository: Repository<Destination>, propertyRepository: Repository<Property>);
    findAll(): Promise<Destination[]>;
    create(destination: Partial<Destination>): Promise<Destination>;
}
