import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_availability')
export class PropertyAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertyId: number;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceOverride: number;

  @Column({ default: true })
  isAvailable: boolean;
}
