import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('host_actions')
export class HostAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hostId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  type: string; // e.g., 'listing_setup', 'verification', 'booking_request'

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
