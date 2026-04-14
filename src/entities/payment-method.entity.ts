import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('payment_methods')
export class PaymentMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    stripePaymentMethodId: string;

    @Column()
    brand: string;

    @Column()
    last4: string;

    @Column()
    expMonth: number;

    @Column()
    expYear: number;

    @Column({ default: false })
    isDefault: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
