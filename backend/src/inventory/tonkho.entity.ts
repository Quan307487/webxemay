import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sanpham } from '../products/sanpham.entity';

@Entity('tonkho')
export class Tonkho {
    @PrimaryGeneratedColumn() ma_tonkho: number;
    @Column({ unique: true }) ma_sanpham: number;
    @Column({ default: 0 }) soluong_tonkho: number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }) ngay_cap_nhat: Date;
    @ManyToOne(() => Sanpham, (s: Sanpham) => s.tonkho, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_sanpham' }) sanpham: Sanpham;
}
