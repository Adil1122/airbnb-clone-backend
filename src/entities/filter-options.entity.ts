import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('guest_categories')
export class GuestCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column()
    sublabel: string;

    @Column()
    type: string; // 'adults', 'children', etc.
}

@Entity('search_durations')
export class SearchDuration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column()
    value: string; // 'weekend', 'week', 'month'
}
