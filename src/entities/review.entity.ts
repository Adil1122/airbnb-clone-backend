import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Property } from './property.entity';
import { User } from './user.entity';

export enum ReviewType {
  GUEST_TO_HOST = 'guest_to_host',
  HOST_TO_GUEST = 'host_to_guest',
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bookingId: number;

  @Column()
  propertyId: number;

  @ManyToOne(() => Property, (property) => property.reviews)
  property: Property;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  // reviewerId = the person writing; revieweeId = the person being reviewed
  @Column({ nullable: true })
  reviewerId: number;

  @Column({ nullable: true })
  revieweeId: number;

  @Column({ type: 'enum', enum: ReviewType, default: ReviewType.GUEST_TO_HOST })
  type: ReviewType;

  @Column('text', { nullable: true })
  reviewText: string;

  @Column('text', { nullable: true })
  privateFeedback: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  // Category ratings (guest-to-host)
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  cleanlinessRating: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  accuracyRating: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  checkinRating: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  communicationRating: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  locationRating: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  valueRating: number;

  @Column({ default: true })
  isPublic: boolean;

  // Host response to a review
  @Column('text', { nullable: true })
  response: string;

  @Column({ nullable: true })
  respondedAt: Date;

  @Column({ nullable: true })
  reviewDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
