import { User } from './user.entity';
export declare class Service {
    id: number;
    title: string;
    location: string;
    price: number;
    rating: number;
    imageUrl: string;
    category: string;
    duration: string;
    availableFrom: Date;
    availableTo: Date;
    maxAdults: number;
    maxChildren: number;
    maxInfants: number;
    hostId: number;
    host: User;
}
