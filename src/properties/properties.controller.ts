import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { Property } from '../entities/property.entity';
import { Amenity } from '../entities/amenity.entity';
import { Review } from '../entities/review.entity';

@Controller('properties')
export class PropertiesController {
    constructor(private readonly propertiesService: PropertiesService) { }

    @Get()
    findAll(@Query('categoryId') categoryId?: string): Promise<Property[]> {
        console.log(`[DEBUG] Received request for all properties${categoryId ? ' with category ' + categoryId : ''}`);
        const numericCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
        return this.propertiesService.findAll(numericCategoryId);
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
        @Query('infants') infants?: string,
        @Query('pets') pets?: string,
    ): Promise<Property[]> {
        return this.propertiesService.search({
            location,
            startDate,
            endDate,
            monthsCount: monthsCount ? parseInt(monthsCount, 10) : undefined,
            flexibleType,
            flexibleMonths: flexibleMonths ? flexibleMonths.split(',') : undefined,
            adults: adults ? parseInt(adults, 10) : undefined,
            children: children ? parseInt(children, 10) : undefined,
            infants: infants ? parseInt(infants, 10) : undefined,
            pets: pets !== undefined ? pets === 'true' : undefined,
        });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Property | null> {
        return this.propertiesService.findOne(id);
    }

    @Get(':id/amenities')
    findAmenities(@Param('id', ParseIntPipe) id: number): Promise<Amenity[]> {
        return this.propertiesService.findAmenities(id);
    }

    @Get(':id/reviews')
    findReviews(@Param('id', ParseIntPipe) id: number): Promise<Review[]> {
        return this.propertiesService.findReviews(id);
    }
}
