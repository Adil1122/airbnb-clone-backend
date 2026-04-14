import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';

@Injectable()
export class DestinationsService {
    constructor(
        @InjectRepository(Destination)
        private destinationsRepository: Repository<Destination>,
    ) { }

    findAll(): Promise<Destination[]> {
        return this.destinationsRepository.find();
    }

    create(destination: Partial<Destination>): Promise<Destination> {
        return this.destinationsRepository.save(destination);
    }
}
