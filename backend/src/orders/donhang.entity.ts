import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Chitietdonhang } from './chitietdonhang.entity';
import { Thanhtoan } from '../payments/thanhtoan.entity';

@Entity('donhang')
export class Donhang {
    @PrimaryGeneratedColumn() ma_donhang: number;
    @Column({ unique: true }) donhang_code: string;
    @Column() ma_user: number;
    @CreateDateColumn() ngay_dat: Date;
    @Column({ type: 'enum', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'], default: 'pending' }) trang_thai: string;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) tong_tien: number;
    @Column({ type: 'decimal', precision: 10, scale: 0, default: 0 }) phi_van_chuyen: number;
    @Column({ type: 'enum', enum: ['credit_card', 'bank_transfer', 'cod', 'momo', 'vnpay'] }) phuong_thuc_TT: string;
    @Column({ type: 'enum', enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }) trang_thai_TT: string;
    @Column() dia_chi_giao: string;
    @Column({ nullable: true }) ten_nguoi_nhan: string;
    @Column({ nullable: true }) sdt_nguoi_nhan: string;
    @Column({ type: 'text', nullable: true }) ghi_chu: string;
    @Column({ type: 'date', nullable: true }) day_du_kien: Date;
    @Column({ type: 'date', nullable: true }) day_thuc_te: Date;
    @ManyToOne(() => User, (u: User) => u.donhang) @JoinColumn({ name: 'ma_user' }) user: User;
    @OneToMany(() => Chitietdonhang, (c: Chitietdonhang) => c.donhang) chitietdonhang: Chitietdonhang[];
    @OneToMany(() => Thanhtoan, (t: Thanhtoan) => t.donhang) thanhtoan: Thanhtoan[];
}
