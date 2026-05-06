import { Property } from './property.entity';
import { User } from './user.entity';
export declare enum ReviewType {
    GUEST_TO_HOST = "guest_to_host",
    HOST_TO_GUEST = "host_to_guest"
}
export declare class Review {
    id: number;
    bookingId: number;
    propertyId: number;
    property: Property;
    userId: number;
    user: User;
    reviewerId: number;
    revieweeId: number;
    type: ReviewType;
    reviewText: string;
    privateFeedback: string;
    rating: number;
    cleanlinessRating: number;
    accuracyRating: number;
    checkinRating: number;
    communicationRating: number;
    locationRating: number;
    valueRating: number;
    isPublic: boolean;
    response: string;
    respondedAt: Date;
    reviewDate: string;
    createdAt: Date;
    updatedAt: Date;
}
