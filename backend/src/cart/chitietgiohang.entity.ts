import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Giohang } from './giohang.entity';
import { Sanpham } from '../products/sanpham.entity';

@Entity('chitietgiohang')
export class Chitietgiohang {
    @PrimaryGeneratedColumn() ma_CTGH: number;
    @Column() ma_gio: number;
    @Column() ma_sanpham: number;
    @Column({ nullable: true }) mau_chon: string;
    @Column({ default: 1 }) so_luong: number;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) gia_hien_tai: number;
    @ManyToOne(() => Giohang, (g: Giohang) => g.chitietgiohang, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_gio' }) giohang: Giohang;
    @ManyToOne(() => Sanpham, (s: Sanpham) => s.chitietgiohang) @JoinColumn({ name: 'ma_sanpham' }) sanpham: Sanpham;
}
