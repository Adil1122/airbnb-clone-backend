import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

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


    @Column({ name: 'host_id', nullable: true })
    hostId: number;

    @ManyToOne(() => User, (user) => user.experiences)
    @JoinColumn({ name: 'host_id' })
    host: User;
}
