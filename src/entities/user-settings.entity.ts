import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  // Privacy Settings
  @Column({ default: true })
  showReadReceipts: boolean;

  @Column({ default: false })
  includeInSearch: boolean;

  @Column({ default: true })
  showHomeCity: boolean;

  @Column({ default: true })
  showTripType: boolean;

  @Column({ default: true })
  showLengthOfStay: boolean;

  @Column({ default: true })
  showBookedServices: boolean;

  @Column({ default: true })
  improveAI: boolean;

  // Notification Settings (stored as JSON)
  @Column({ type: 'json', nullable: true })
  notificationPreferences: any;

  // Accessibility Settings
  @Column({ default: false })
  mapZoomControls: boolean;

  @Column({ default: false })
  mapPanControls: boolean;

  // Translation Settings
  @Column({ default: true })
  autoTranslate: boolean;

  @Column({ default: 'English' })
  preferredLanguage: string;

  // Travel for Work
  @Column({ nullable: true })
  businessEmail: string;

  @Column({ default: false })
  isTravelForWorkEnabled: boolean;

  // Tax Settings
  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  taxCountry: string;

  @Column({ nullable: true })
  vatNumber: string;
}
