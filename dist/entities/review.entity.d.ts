import { Property } from './property.entity';
import { User } from './user.entity';
export declare class Review {
    id: number;
    propertyId: number;
    property: Property;
    userId: number;
    user: User;
    reviewText: string;
    rating: number;
    reviewDate: string;
}
