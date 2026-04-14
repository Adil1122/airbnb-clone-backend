import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class PropertyImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @Column()
    category: string; // 'Living Room', 'Full kitchen', 'Bedroom 1', 'Bedroom 2', 'Bathroom 1', 'Bathroom 2', 'Additional images'

    @ManyToOne(() => Property, (property) => property.images)
    property: Property;
}
