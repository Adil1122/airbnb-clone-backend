import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { User } from './user.entity';
import { randomUUID } from 'crypto';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export enum CancellationPolicy {
  FLEXIBLE = 'flexible',
  MODERATE = 'moderate',
  STRICT = 'strict',
  SUPER_STRICT_30 = 'super_strict_30',
  SUPER_STRICT_60 = 'super_strict_60',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) this.uuid = randomUUID();
  }

  @Column()
  propertyId: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  hostId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Dates
  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column({ type: 'int' })
  nights: number;

  // Guests breakdown
  @Column({ type: 'int', default: 1 })
  guests: number;

  @Column({ type: 'int', default: 0 })
  numChildren: number;

  @Column({ type: 'int', default: 0 })
  numInfants: number;

  @Column({ type: 'int', default: 0 })
  numPets: number;

  // Pricing snapshot (locked at booking time)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  propertyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cleaningFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hostPayoutAmount: number;

  // Status
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'enum', enum: CancellationPolicy, default: CancellationPolicy.MODERATE })
  cancellationPolicy: CancellationPolicy;

  // Stripe
  @Column({ length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ length: 255, nullable: true })
  stripeChargeId: string;

  @Column({ length: 255, nullable: true })
  stripeTransferId: string;

  @Column({ length: 255, nullable: true })
  stripeApplicationFeeId: string;

  @Column({ type: 'json', nullable: true })
  stripeResponse: any;

  // Messages
  @Column({ type: 'text', nullable: true })
  messageToHost: string;

  @Column({ type: 'text', nullable: true })
  hostMessage: string;

  // Timestamps
  @Column({ nullable: true })
  confirmedAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelledBy: number;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string | null;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
