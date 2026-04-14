import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { PropertyImage } from './property-image.entity';
import { Review } from './review.entity';
import { PropertyRule } from './property-rule.entity';

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

    @Column('int')
    reviewCount: number;

    @Column('text')
    imageUrl: string;

    @Column()
    status: string;

    @Column()
    type: string;

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

    @Column({ default: 0 })
    bedrooms: number;

    @Column({ default: 0 })
    beds: number;

    @Column({ default: 0 })
    bathrooms: number;

    @Column({ default: 0 })
    kitchens: number;

    @Column({ default: false })
    allowPets: boolean;

    @Column({ nullable: true })
    hostName: string;

    @Column('text', { nullable: true })
    hostImage: string;

    @Column('text', { nullable: true })
    hostBio: string;

    @Column({ nullable: true })
    hostSince: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('boolean', { default: false })
    hasGreatLocation: boolean;

    @Column('text', { nullable: true })
    greatLocationDesc: string;

    @Column('boolean', { default: false })
    hasFastWifi: boolean;

    @Column('text', { nullable: true })
    fastWifiDesc: string;

    @Column('boolean', { default: false })
    hasGuestFavorite: boolean;

    @Column('text', { nullable: true })
    guestFavoriteDesc: string;

    @ManyToOne(() => Category, (category) => category.properties)
    category: Category;

    @OneToMany(() => PropertyImage, (image) => image.property, { cascade: true })
    images: PropertyImage[];

    @OneToMany(() => Review, (review) => review.property)
    reviews: Review[];

    @OneToMany(() => PropertyRule, (rule) => rule.property)
    rules: PropertyRule[];
}
