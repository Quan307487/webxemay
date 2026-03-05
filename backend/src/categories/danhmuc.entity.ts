import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sanpham } from '../products/sanpham.entity';

@Entity('danhmuc')
export class Danhmuc {
    @PrimaryGeneratedColumn() ma_danhmuc: number;
    @Column({ unique: true }) ten_danhmuc: string;
    @Column({ type: 'text', nullable: true }) mo_ta: string;
    @Column({ default: 1 }) is_active: number;
    @OneToMany(() => Sanpham, (s: Sanpham) => s.danhmuc) sanpham: Sanpham[];
}
