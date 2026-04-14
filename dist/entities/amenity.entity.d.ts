import { Property } from './property.entity';
export declare class Amenity {
    id: number;
    name: string;
    icon: string;
    propertyId: number;
    property: Property;
}
