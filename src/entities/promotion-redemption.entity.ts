import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Promotion } from './promotion.entity';
import { User } from './user.entity';
import { Booking } from './booking.entity';

@Entity('promotion_redemptions')
export class PromotionRedemption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  promotionId: number;

  @ManyToOne(() => Promotion, (p) => p.redemptions)
  @JoinColumn({ name: 'promotionId' })
  promotion: Promotion;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  bookingId: number;

  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column('decimal', { precision: 10, scale: 2 })
  discountAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}
