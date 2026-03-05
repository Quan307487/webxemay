import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Donhang } from './donhang.entity';
import { Sanpham } from '../products/sanpham.entity';

@Entity('chitietdonhang')
export class Chitietdonhang {
    @PrimaryGeneratedColumn() ma_CTDH: number;
    @Column() ma_donhang: number;
    @Column() ma_sanpham: number;
    @Column({ nullable: true }) ten_sanpham: string;
    @Column({ nullable: true }) mau_xe: string;
    @Column() so_luong: number;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) don_gia: number;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) thanh_tien: number;
    @ManyToOne(() => Donhang, (d: Donhang) => d.chitietdonhang, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_donhang' }) donhang: Donhang;
    @ManyToOne(() => Sanpham, (s: Sanpham) => s.chitietdonhang) @JoinColumn({ name: 'ma_sanpham' }) sanpham: Sanpham;
}
