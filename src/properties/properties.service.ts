import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';

@Injectable()
export class PropertiesService {
    constructor(
        @InjectRepository(Property)
        private propertyRepository: Repository<Property>,
    ) { }

    findAll(categoryId?: number): Promise<Property[]> {
        if (categoryId) {
            return this.propertyRepository.find({
                where: { category: { id: categoryId } },
                relations: ['category'],
            });
        }
        return this.propertyRepository.find({ relations: ['category'] });
    }

    findOne(id: number): Promise<Property | null> {
        return this.propertyRepository.findOne({
            where: { id },
            relations: ['category'],
        });
    }

    async create(property: Partial<Property>): Promise<Property> {
        const newProperty = this.propertyRepository.create(property);
        return this.propertyRepository.save(newProperty);
    }
}
