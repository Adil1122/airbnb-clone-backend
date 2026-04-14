import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('destinations')
export class Destination {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    region: string;

    @Column('text')
    imageUrl: string;

    @Column()
    type: string; // 'region' | 'city'
}
