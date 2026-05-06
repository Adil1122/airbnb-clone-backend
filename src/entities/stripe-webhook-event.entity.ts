import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('stripe_webhook_events')
export class StripeWebhookEvent {
  @PrimaryColumn()
  id: string; // Stripe's evt_xxx ID

  @Column()
  type: string;

  @Column({ type: 'json' })
  payload: any;

  @Column({ default: false })
  processed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
