import { DestinationsService } from './destinations.service';
import { Destination } from '../entities/destination.entity';
export declare class DestinationsController {
    private readonly destinationsService;
    constructor(destinationsService: DestinationsService);
    findAll(): Promise<Destination[]>;
}
