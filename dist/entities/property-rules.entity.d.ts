import { Property } from './property.entity';
export declare class PropertyRules {
    id: number;
    propertyId: number;
    property: Property;
    checkInTime: string;
    checkOutTime: string;
    maxGuests: number;
    additionalHouseRules: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
    partiesAllowed: boolean;
    quietHours: boolean;
    smokeAlarm: boolean;
    carbonMonoxideAlarm: boolean;
    securityCamera: boolean;
    weaponOnProperty: boolean;
    cancellationPolicy: string;
    cancellationPolicyDesc: string;
    refundCutoffDays: number;
}
