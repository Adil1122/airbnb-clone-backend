import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_rules')
export class PropertyRules {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    propertyId: number;

    @OneToOne(() => Property)
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column({ default: '3:00 PM' })
    checkInTime: string;

    @Column({ default: '11:00 AM' })
    checkOutTime: string;

    @Column({ default: 5 })
    maxGuests: number;

    @Column({ type: 'text', nullable: true })
    additionalHouseRules: string;

    @Column({ default: true })
    smokingAllowed: boolean;

    @Column({ default: false })
    petsAllowed: boolean;

    @Column({ default: true })
    partiesAllowed: boolean;

    @Column({ default: true })
    quietHours: boolean;

    @Column({ default: true })
    smokeAlarm: boolean;

    @Column({ default: false })
    carbonMonoxideAlarm: boolean;

    @Column({ default: true })
    securityCamera: boolean;

    @Column({ default: false })
    weaponOnProperty: boolean;

    @Column({ default: 'flexible' })
    cancellationPolicy: string;

    @Column({ type: 'text', nullable: true })
    cancellationPolicyDesc: string;

    @Column({ nullable: true })
    refundCutoffDays: number;
}
