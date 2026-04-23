import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from '../entities/service.entity';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    findAll(): Promise<Service[]> {
        return this.servicesService.findAll();
    }

    @Get('categories')
    findAllCategories(): Promise<string[]> {
        return this.servicesService.findAllCategories();
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
        @Query('category') category?: string,
    ): Promise<Service[]> {
        return this.servicesService.search({
            location,
            startDate,
            endDate,
            monthsCount: monthsCount ? parseInt(monthsCount, 10) : undefined,
            flexibleType,
            flexibleMonths: flexibleMonths ? flexibleMonths.split(',') : undefined,
            adults: adults ? parseInt(adults, 10) : undefined,
            children: children ? parseInt(children, 10) : undefined,
            category,
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Service | null> {
        return this.servicesService.findOne(id);
    }
}
