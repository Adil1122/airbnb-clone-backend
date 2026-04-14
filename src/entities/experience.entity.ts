import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('experiences')
export class Experience {
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
    reviews: number;

    @Column()
    category: string;

    @Column({ type: 'date', nullable: true })
    availableFrom: Date;

    @Column({ type: 'date', nullable: true })
    availableTo: Date;

    @Column({ default: 0 })
    maxAdults: number;

    @Column({ default: 0 })
    maxChildren: number;

    @Column({ default: 0 })
    maxInfants: number;

    @Column({ default: false })
    allowPets: boolean;
}
