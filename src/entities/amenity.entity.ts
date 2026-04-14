import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity('amenities')
export class Amenity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    icon: string;

    @Column()
    propertyId: number;

    @ManyToOne(() => Property)
    property: Property;
}
