import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) { }

    async findAll(): Promise<Service[]> {
        return this.servicesRepository.find();
    }

    async search(params: {
        location?: string;
        startDate?: string;
        endDate?: string;
        monthsCount?: number;
        flexibleType?: string;
        flexibleMonths?: string[];
        adults?: number;
        children?: number;
    }): Promise<Service[]> {
        const { location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children } = params;
        const query = this.servicesRepository.createQueryBuilder('service');

        if (location) {
            query.andWhere('service.location LIKE :location', { location: `%${location}%` });
        }

        if (startDate) {
            const sDate = new Date(startDate);
            query.andWhere('service.availableFrom <= :sDate', { sDate });
            if (endDate) {
                const eDate = new Date(endDate);
                query.andWhere('service.availableTo >= :eDate', { eDate });
            }
        }

        if (monthsCount) {
            const today = new Date();
            const future = new Date();
            future.setMonth(today.getMonth() + monthsCount);
            query.andWhere('service.availableFrom <= :today', { today });
            query.andWhere('service.availableTo >= :future', { future });
        }

        if (flexibleMonths && flexibleMonths.length > 0) {
            const monthMap: Record<string, number> = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const conditions = flexibleMonths.map((m, i) => {
                const monthIdx = monthMap[m];
                return `(service.availableFrom <= :eom${i} AND service.availableTo >= :som${i})`;
            }).join(' OR ');
            const parameters: any = {};
            flexibleMonths.forEach((m, i) => {
                const monthIdx = monthMap[m];
                parameters[`som${i}`] = new Date(2026, monthIdx, 1);
                parameters[`eom${i}`] = new Date(2026, monthIdx + 1, 0);
            });
            query.andWhere(`(${conditions})`, parameters);
        }

        if (adults) {
            query.andWhere('service.maxAdults >= :adults', { adults });
        }

        if (children) {
            query.andWhere('service.maxChildren >= :children', { children });
        }

        return query.getMany();
    }

    create(service: Partial<Service>): Promise<Service> {
        const newService = this.servicesRepository.create(service);
        return this.servicesRepository.save(newService);
    }
}
