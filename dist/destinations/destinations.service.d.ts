import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
export declare class DestinationsService {
    private destinationsRepository;
    constructor(destinationsRepository: Repository<Destination>);
    findAll(): Promise<Destination[]>;
    create(destination: Partial<Destination>): Promise<Destination>;
}
