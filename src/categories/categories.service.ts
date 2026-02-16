import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async create(category: Partial<Category>): Promise<Category> {
        const newCategory = this.categoryRepository.create(category);
        return this.categoryRepository.save(newCategory);
    }
}
