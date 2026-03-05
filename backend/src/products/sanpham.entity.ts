import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Danhmuc } from '../categories/danhmuc.entity';
import { Thuonghieu } from '../brands/thuonghieu.entity';
import { Hinhanh } from './hinhanh.entity';
import { Chitietgiohang } from '../cart/chitietgiohang.entity';
import { Chitietdonhang } from '../orders/chitietdonhang.entity';
import { Danhgia } from '../reviews/danhgia.entity';
import { Dsyeuthich } from '../wishlist/dsyeuthich.entity';
import { Tonkho } from '../inventory/tonkho.entity';

@Entity('sanpham')
export class Sanpham {
    @PrimaryGeneratedColumn() ma_sanpham: number;
    @Column() ten_sanpham: string;
    @Column({ nullable: true, unique: true }) sanpham_code: string;
    @Column() ma_danhmuc: number;
    @Column() ma_thuonghieu: number;
    @Column({ type: 'text', nullable: true }) mo_ta: string;
    @Column({ type: 'decimal', precision: 12, scale: 0 }) gia: number;
    @Column({ type: 'enum', enum: ['percentage', 'fixed_amount'], default: 'percentage' }) kieu_giam_gia: string;
    @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 }) gia_tri_giam: number;
    @Column({ default: 0 }) ton_kho: number;

    // Thông số kỹ thuật xe máy
    @Column({ type: 'year', nullable: true }) nam_san_xuat: number;
    @Column({ nullable: true }) mau_sac: string;
    @Column({ type: 'enum', enum: ['xe_so', 'xe_ga', 'xe_con_tay', 'xe_dien', 'phan_khoi_lon'] }) kieu_xe: string;
    @Column({ nullable: true }) dung_tich_dong_co: string;
    @Column({ nullable: true }) loai_dong_co: string;
    @Column({ type: 'enum', enum: ['xang', 'dien', 'hybrid'], default: 'xang' }) loai_nhien_lieu: string;
    @Column({ nullable: true }) muc_tieu_thu: string;
    @Column({ nullable: true }) cong_suat_toi_da: string;
    @Column({ nullable: true }) momen_xoan_toi_da: string;
    @Column({ type: 'enum', enum: ['so_tay', 'tu_dong', 'ban_tu_dong', 'khong_hop_so'], default: 'tu_dong' }) hop_so: string;
    @Column({ type: 'enum', enum: ['trong', 'dia', 'trong_truoc_dia_sau', 'abs'], default: 'trong' }) he_thong_phanhang: string;
    @Column({ type: 'enum', enum: ['de_chan', 'de_dien', 'ca_hai'], default: 'ca_hai' }) he_thong_khoi_dong: string;
    @Column({ type: 'decimal', precision: 6, scale: 1, nullable: true }) trong_luong_kho: number;
    @Column({ nullable: true }) kich_thuoc: string;
    @Column({ type: 'decimal', precision: 5, scale: 1, nullable: true }) chieu_cao_yen: number;
    @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true }) dung_tich_binh_xang: number;
    @Column({ nullable: true }) cong_suat_pin: string;
    @Column({ nullable: true }) pham_vi_hanh_trinh: string;
    @Column({ nullable: true }) kich_co_lop_truoc: string;
    @Column({ nullable: true }) kich_co_lop_sau: string;
    @Column({ nullable: true }) xuat_xu: string;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 }) diem_danh_gia: number;
    @Column({ default: 1 }) is_active: number;
    @CreateDateColumn() ngay_lap: Date;

    @ManyToOne(() => Danhmuc, (d: Danhmuc) => d.sanpham) @JoinColumn({ name: 'ma_danhmuc' }) danhmuc: Danhmuc;
    @ManyToOne(() => Thuonghieu, (t: Thuonghieu) => t.sanpham) @JoinColumn({ name: 'ma_thuonghieu' }) thuonghieu: Thuonghieu;
    @OneToMany(() => Hinhanh, (h: Hinhanh) => h.sanpham) hinhanh: Hinhanh[];
    @OneToMany(() => Chitietgiohang, (c: Chitietgiohang) => c.sanpham) chitietgiohang: Chitietgiohang[];
    @OneToMany(() => Chitietdonhang, (c: Chitietdonhang) => c.sanpham) chitietdonhang: Chitietdonhang[];
    @OneToMany(() => Danhgia, (d: Danhgia) => d.sanpham) danhgia: Danhgia[];
    @OneToMany(() => Dsyeuthich, (w: Dsyeuthich) => w.sanpham) dsyeuthich: Dsyeuthich[];
    @OneToMany(() => Tonkho, (tk: Tonkho) => tk.sanpham) tonkho: Tonkho[];
}
