import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';

@Injectable()
export class ExperiencesService {
    constructor(
        @InjectRepository(Experience)
        private experiencesRepository: Repository<Experience>,
    ) { }

    async findAll(): Promise<Experience[]> {
        return this.experiencesRepository.find();
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
    }): Promise<Experience[]> {
        console.log(`[DEBUG] Searching experiences with params:`, params);
        const { location, startDate, endDate, monthsCount, flexibleType, flexibleMonths, adults, children } = params;
        const query = this.experiencesRepository.createQueryBuilder('experience');

        if (location && location.trim() !== '' && !location.includes('Search destinations')) {
            const keyword = location.split(/[, ]+/)[0]; 
            console.log(`[DEBUG] Using location keyword: ${keyword}`);
            query.andWhere('experience.location LIKE :keyword', { keyword: `%${keyword}%` });
        }

        if (startDate && startDate !== 'Add dates') {
            try {
                const sDate = new Date(startDate);
                if (!isNaN(sDate.getTime())) {
                    query.andWhere('(experience.availableFrom IS NULL OR experience.availableFrom <= :sDate)', { sDate });
                    if (endDate && endDate !== 'Add dates') {
                        const eDate = new Date(endDate);
                        if (!isNaN(eDate.getTime())) {
                            query.andWhere('(experience.availableTo IS NULL OR experience.availableTo >= :eDate)', { eDate });
                        }
                    }
                }
            } catch (e) {
                console.error('[ERROR] Parsing dates in search:', e);
            }
        }

        if (flexibleMonths && flexibleMonths.length > 0) {
            const monthMap: Record<string, number> = {
                'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
                'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const conditions = flexibleMonths.map((m, i) => {
                const monthIdx = monthMap[m];
                return `(experience.availableFrom <= :eom${i} AND experience.availableTo >= :som${i})`;
            }).join(' OR ');
            const parameters: any = {};
            flexibleMonths.forEach((m, i) => {
                const monthIdx = monthMap[m];
                parameters[`som${i}`] = new Date(2026, monthIdx, 1);
                parameters[`eom${i}`] = new Date(2026, monthIdx + 1, 0);
            });
            query.andWhere(`(${conditions})`, parameters);
        }

        if (adults) query.andWhere('experience.maxAdults >= :adults', { adults });
        if (children) query.andWhere('experience.maxChildren >= :children', { children });

        return query.getMany();
    }

    async findOne(id: number): Promise<Experience | null> {
        return this.experiencesRepository.findOne({ where: { id } });
    }

    create(experience: Partial<Experience>): Promise<Experience> {
        return this.experiencesRepository.save(experience);
    }
}
