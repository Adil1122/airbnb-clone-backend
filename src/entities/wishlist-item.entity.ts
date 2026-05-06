import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, Unique } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Property } from './property.entity';

@Entity('wishlist_items')
@Unique(['wishlistId', 'propertyId'])
export class WishlistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wishlistId: number;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlistId' })
  wishlist: Wishlist;

  @Column()
  propertyId: number;

  @ManyToOne(() => Property, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ length: 500, nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}
