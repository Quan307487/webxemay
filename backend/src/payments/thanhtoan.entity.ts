import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Donhang } from '../orders/donhang.entity';
import { MaKhuyenmai } from '../coupons/ma-khuyenmai.entity';

@Entity('thanhtoan')
export class Thanhtoan {
    @PrimaryGeneratedColumn() ma_thanhtoan: number;
    @Column() ma_donhang: number;
    @CreateDateColumn() ngay_thanhtoan: Date;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) thanh_tien: number;
    @Column({ type: 'enum', enum: ['credit_card', 'bank_transfer', 'cod', 'momo', 'vnpay'] }) PT_thanhtoan: string;
    @Column({ nullable: true }) ma_giao_dich: string;
    @Column({ nullable: true }) ma_giamgia: string;
    @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 }) so_tien_giamgia: number;
    @Column({ type: 'enum', enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' }) trang_thai: string;
    @Column({ nullable: true }) ghi_chu: string;
    @ManyToOne(() => Donhang, (d: Donhang) => d.thanhtoan, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_donhang' }) donhang: Donhang;
}
