import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from '../entities/property.entity';

@Controller('properties')
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) { }

    @Get()
    findAll(@Query('categoryId') categoryId?: string): Promise<Property[]> {
        const numericCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        return this.propertiesService.findAll(numericCategoryId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Property | null> {
        return this.propertiesService.findOne(id);
    }
}
