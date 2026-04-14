import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { Experience } from '../entities/experience.entity';

@Controller('experiences')
export class ExperiencesController {
    constructor(private readonly experiencesService: ExperiencesService) { }

    @Get()
    findAll(): Promise<Experience[]> {
        return this.experiencesService.findAll();
    }

    @Get('search')
    search(
        @Query('location') location?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('monthsCount') monthsCount?: string,
        @Query('flexibleType') flexibleType?: string,
        @Query('flexibleMonths') flexibleMonths?: string,
        @Query('adults') adults?: string,
        @Query('children') children?: string,
    ): Promise<Experience[]> {
        return this.experiencesService.search({
            location,
            startDate,
            endDate,
            monthsCount: monthsCount ? parseInt(monthsCount, 10) : undefined,
            flexibleType,
            flexibleMonths: flexibleMonths ? flexibleMonths.split(',') : undefined,
            adults: adults ? parseInt(adults, 10) : undefined,
            children: children ? parseInt(children, 10) : undefined,
        });
    }
}
