import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
export declare class CategoriesService {
    private categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    create(category: Partial<Category>): Promise<Category>;
}
