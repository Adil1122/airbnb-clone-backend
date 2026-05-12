import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

@Entity('connections')
@Unique(['requesterId', 'receiverId'])
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requesterId: number;

  @Column()
  receiverId: number;

  @Column({ type: 'varchar', default: ConnectionStatus.PENDING })
  status: ConnectionStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requesterId' })
  requester: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @CreateDateColumn()
  createdAt: Date;
}
