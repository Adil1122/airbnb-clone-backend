import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Property } from './property.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column()
    iconName: string;

    @Column({ unique: true })
    slug: string;

    @OneToMany(() => Property, (property) => property.category)
    properties: Property[];
}
