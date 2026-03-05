import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ma_khuyenmai')
export class MaKhuyenmai {
    @PrimaryGeneratedColumn() ma_khuyenmai: number;
    @Column({ unique: true }) ma_giamgia: string;
    @Column({ type: 'enum', enum: ['percentage', 'fixed_amount'] }) kieu_giamgia: string;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) giatrigiam: number;
    @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 }) don_toithieu: number;
    @Column({ nullable: true }) solandung: number;
    @Column({ default: 0 }) solan_hientai: number;
    @Column({ type: 'datetime' }) ngay_batdau: Date;
    @Column({ type: 'datetime' }) ngay_ketthuc: Date;
    @Column({ default: 1 }) is_active: number;
}
