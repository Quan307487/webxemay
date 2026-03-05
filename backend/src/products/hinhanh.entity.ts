import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sanpham } from './sanpham.entity';

@Entity('hinhanh')
export class Hinhanh {
    @PrimaryGeneratedColumn() ma_anh: number;
    @Column() ma_sanpham: number;
    @Column() image_url: string;
    @Column({ nullable: true }) mo_ta_anh: string;
    @Column({ default: 0 }) is_main: number;
    @Column({ default: 0 }) thu_tu: number;
    @ManyToOne(() => Sanpham, (s: Sanpham) => s.hinhanh, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_sanpham' }) sanpham: Sanpham;
}
