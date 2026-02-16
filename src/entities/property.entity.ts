import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity('properties')
export class Property {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    location: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 3, scale: 2 })
    rating: number;

    @Column('text')
    imageUrl: string;

    @Column()
    status: string;

    @Column()
    type: string;

    @ManyToOne(() => Category, (category) => category.properties)
    category: Category;
}
