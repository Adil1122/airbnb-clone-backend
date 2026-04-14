import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';
import { User } from './user.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    propertyId: number;

    @ManyToOne(() => Property, (property) => property.reviews)
    property: Property;

    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('text')
    reviewText: string;

    @Column()
    rating: number;

    @Column()
    reviewDate: string;
}
