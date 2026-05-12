import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';

export enum CoHostStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity('co_hosts')
@Unique(['propertyId', 'coHostId'])
export class CoHost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertyId: number;

  @Column()
  hostId: number;

  @Column()
  coHostId: number;

  @Column({ type: 'varchar', default: CoHostStatus.PENDING })
  status: CoHostStatus;

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[];

  @Column({ nullable: true })
  message: string;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'coHostId' })
  coHost: User;

  @CreateDateColumn()
  createdAt: Date;
}
