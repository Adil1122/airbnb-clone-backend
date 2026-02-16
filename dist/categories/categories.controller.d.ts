import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
}
