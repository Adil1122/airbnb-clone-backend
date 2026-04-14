import { PropertiesService } from './properties.service';
import { Property } from '../entities/property.entity';
import { Amenity } from '../entities/amenity.entity';
import { Review } from '../entities/review.entity';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    findAll(categoryId?: string): Promise<Property[]>;
    search(location?: string, startDate?: string, endDate?: string, monthsCount?: string, flexibleType?: string, flexibleMonths?: string, adults?: string, children?: string, infants?: string, pets?: string): Promise<Property[]>;
    findOne(id: number): Promise<Property | null>;
    findAmenities(id: number): Promise<Amenity[]>;
    findReviews(id: number): Promise<Review[]>;
}
