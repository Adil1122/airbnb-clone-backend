import { Property } from './property.entity';
export declare class Category {
    id: number;
    label: string;
    iconName: string;
    slug: string;
    properties: Property[];
}
