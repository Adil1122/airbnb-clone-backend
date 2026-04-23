import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Property } from './property.entity';
import { Experience } from './experience.entity';
import { Service } from './service.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true, type: 'varchar' })
  emailVerificationToken: string | null;

  @Column({ nullable: true, type: 'datetime' })
  emailVerificationExpires: Date | null;

  @Column({ nullable: true })
  verificationSentAt: Date;

  @Column({ nullable: true })
  stripeCustomerId: string;


  @Column({ type: 'varchar', default: 'GUEST' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  hostStatus: string | null;

  @Column({ type: 'datetime', nullable: true })
  hostSince: Date | null;

  @Column({ type: 'text', nullable: true })
  hostBio: string | null;

  @Column({ type: 'simple-array', nullable: true })
  hostLanguages: string[] | null;

  @Column({ default: false })
  isIdentityVerified: boolean;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isSuperhost: boolean;

  @OneToMany(() => Property, (property) => property.host)
  properties: Property[];

  @OneToMany(() => Experience, (experience) => experience.host)
  experiences: Experience[];

  @OneToMany(() => Service, (service) => service.host)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
