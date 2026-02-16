import { OnModuleInit } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';
import { PropertiesService } from './properties/properties.service';
export declare class SeedService implements OnModuleInit {
    private readonly categoriesService;
    private readonly propertiesService;
    constructor(categoriesService: CategoriesService, propertiesService: PropertiesService);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
}
