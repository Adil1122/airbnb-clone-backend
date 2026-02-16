import { Category } from './category.entity';
export declare class Property {
    id: number;
    title: string;
    location: string;
    price: number;
    rating: number;
    imageUrl: string;
    status: string;
    type: string;
    category: Category;
}
