import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum RuleType {
    BOOLEAN = 'boolean',
    TEXT = 'text',
    NUMBER = 'number',
}

@Entity('rule_categories')
export class RuleCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255, nullable: true })
    icon: string;

    @Column({ default: 0 })
    sortOrder: number;

    @Column({ default: true })
    isActive: boolean;
}
