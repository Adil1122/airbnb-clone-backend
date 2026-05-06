import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from '../entities/destination.entity';
import { Property } from '../entities/property.entity';

@Injectable()
export class DestinationsService {
    constructor(
        @InjectRepository(Destination)
        private destinationsRepository: Repository<Destination>,
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
    ) { }

    async findAll(): Promise<Destination[]> {
        // 1. Get curated destinations
        const curated = await this.destinationsRepository.find();
        
        // 2. Get unique locations from properties
        const properties = await this.propertyRepository.find({
            where: { status: 'PUBLISHED' },
            select: ['location']
        });

        const propertyCities = new Set<string>();
        properties.forEach(p => {
            if (p.location) {
                const city = p.location.split(',')[0].trim();
                if (city) propertyCities.add(city);
            }
        });

        // 3. Convert property cities to Destination format (if not already in curated)
        const curatedNames = new Set(curated.map(d => d.name.toLowerCase()));
        const dynamicDestinations: Destination[] = [];

        propertyCities.forEach(city => {
            if (!curatedNames.has(city.toLowerCase())) {
                const d = new Destination();
                d.id = 0; // Temporary ID or handle appropriately
                d.name = city;
                d.region = 'World';
                d.type = 'city';
                d.imageUrl = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                dynamicDestinations.push(d);
            }
        });

        return [...curated, ...dynamicDestinations];
    }

    create(destination: Partial<Destination>): Promise<Destination> {
        return this.destinationsRepository.save(destination);
    }
}
