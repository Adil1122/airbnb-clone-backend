import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertyId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column()
  guests: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  propertyPrice: number;

  @Column({ type: 'int' })
  nights: number;

  @Column({ length: 255 })
  stripePaymentIntentId: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  messageToHost: string;

  @CreateDateColumn()
  createdAt: Date;
}
