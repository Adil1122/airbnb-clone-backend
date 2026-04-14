import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

export enum RuleDisplayType {
    ICON_TEXT = 'icon_text',
    CHECKBOX = 'checkbox',
    TEXT_ONLY = 'text_only',
}

@Entity('property_rules')
export class PropertyRule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    propertyId: number;

    @ManyToOne(() => Property, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column({ nullable: true })
    categoryId: number;

    @Column({ length: 255 })
    categoryName: string;

    @Column({ length: 255, nullable: true })
    categoryIcon: string;

    @Column({ length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: true })
    isPositive: boolean;

    @Column({ type: 'enum', enum: RuleDisplayType, default: RuleDisplayType.ICON_TEXT })
    displayType: RuleDisplayType;

    @Column({ default: 0 })
    sortOrder: number;
}
