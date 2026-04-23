import { User } from './user.entity';
export declare class Experience {
    id: number;
    title: string;
    location: string;
    price: number;
    rating: number;
    imageUrl: string;
    reviews: number;
    category: string;
    availableFrom: Date;
    availableTo: Date;
    maxAdults: number;
    maxChildren: number;
    maxInfants: number;
    hostId: number;
    host: User;
}
