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

        if (location && location.trim() !== '' && !location.includes('Search destinations')) {
            const keyword = location.split(/[, ]+/)[0];
            query.andWhere('service.location LIKE :keyword', { keyword: `%${keyword}%` });
        }

        if (startDate && startDate !== 'Add dates') {
            try {
                const sDate = new Date(startDate);
                if (!isNaN(sDate.getTime())) {
                    query.andWhere('(service.availableFrom IS NULL OR service.availableFrom <= :sDate)', { sDate });
                    if (endDate && endDate !== 'Add dates') {
                        const eDate = new Date(endDate);
                        if (!isNaN(eDate.getTime())) {
                            query.andWhere('(service.availableTo IS NULL OR service.availableTo >= :eDate)', { eDate });
                        }
                    }
                }
            } catch (e) {
                console.error('[ERROR] Parsing dates in service search:', e);
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

    async findOne(id: number): Promise<Service | null> {
        return this.servicesRepository.findOne({ where: { id } });
    }

    create(service: Partial<Service>): Promise<Service> {
        const newService = this.servicesRepository.create(service);
        return this.servicesRepository.save(newService);
    }
}
