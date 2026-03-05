import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sanpham } from '../products/sanpham.entity';

@Entity('thuonghieu')
export class Thuonghieu {
    @PrimaryGeneratedColumn() ma_thuonghieu: number;
    @Column({ unique: true }) ten_thuonghieu: string;
    @Column({ nullable: true }) nuoc_san_xuat: string;
    @Column({ nullable: true }) logo_url: string;
    @Column({ type: 'text', nullable: true }) mo_ta: string;
    @Column({ default: 1 }) is_active: number;
    @OneToMany(() => Sanpham, (s: Sanpham) => s.thuonghieu) sanpham: Sanpham[];
}
