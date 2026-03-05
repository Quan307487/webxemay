import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Sanpham } from '../products/sanpham.entity';
import { User } from '../users/user.entity';

@Entity('danhgia')
export class Danhgia {
    @PrimaryGeneratedColumn() ma_danhgia: number;
    @Column() ma_sanpham: number;
    @Column() ma_user: number;
    @Column({ nullable: true }) ma_donhang: number;
    @Column({ type: 'int' }) diem_danhgia: number;
    @Column({ nullable: true }) tieu_de: string;
    @Column({ type: 'text', nullable: true }) viet_danhgia: string;
    @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' }) trang_thai: string;
    @CreateDateColumn() ngay_lap: Date;
    @ManyToOne(() => Sanpham, (s: Sanpham) => s.danhgia, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_sanpham' }) sanpham: Sanpham;
    @ManyToOne(() => User, (u: User) => u.danhgia, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_user' }) user: User;
}
