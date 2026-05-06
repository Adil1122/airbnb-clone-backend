import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bookingId: number;

  @Column()
  listingId: number;

  @ManyToOne(() => Property, { eager: false })
  @JoinColumn({ name: 'listingId' })
  listing: Property;

  @Column()
  guestId: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'guestId' })
  guest: User;

  @Column()
  hostId: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
