import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: true })
  bookingUpdatesEmail: boolean;

  @Column({ default: true })
  bookingUpdatesPush: boolean;

  @Column({ default: false })
  bookingUpdatesSms: boolean;

  @Column({ default: true })
  messagesEmail: boolean;

  @Column({ default: true })
  messagesPush: boolean;

  @Column({ default: false })
  promotionsEmail: boolean;

  @Column({ default: false })
  promotionsPush: boolean;

  @Column({ default: true })
  remindersEmail: boolean;

  @Column({ default: true })
  remindersPush: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
