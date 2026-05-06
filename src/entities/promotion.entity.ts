import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PromotionRedemption } from './promotion-redemption.entity';

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_NIGHTS = 'free_nights',
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ type: 'enum', enum: PromotionType })
  type: PromotionType;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'smallint', default: 1 })
  minNights: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  minBookingAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxDiscount: number;

  @Column({ type: 'int', nullable: true })
  maxUses: number;

  @Column({ type: 'int', default: 0 })
  usesCount: number;

  @Column({ type: 'smallint', default: 1 })
  maxUsesPerUser: number;

  @Column({ type: 'timestamp' })
  validFrom: Date;

  @Column({ type: 'timestamp' })
  validUntil: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => PromotionRedemption, (r) => r.promotion)
  redemptions: PromotionRedemption[];

  @CreateDateColumn()
  createdAt: Date;
}
