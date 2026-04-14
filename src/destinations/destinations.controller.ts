import { Controller, Get } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from '../entities/destination.entity';

@Controller('destinations')
export class DestinationsController {
    constructor(private readonly destinationsService: DestinationsService) { }

    @Get()
    findAll(): Promise<Destination[]> {
        return this.destinationsService.findAll();
    }
}
