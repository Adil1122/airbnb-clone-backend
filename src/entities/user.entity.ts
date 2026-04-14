import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
