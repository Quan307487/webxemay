import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Giohang } from '../cart/giohang.entity';
import { Donhang } from '../orders/donhang.entity';
import { Danhgia } from '../reviews/danhgia.entity';
import { Dsyeuthich } from '../wishlist/dsyeuthich.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn() ma_user: number;
    @Column({ unique: true }) ten_user: string;
    @Column({ unique: true }) email: string;
    @Column() password_hash: string;
    @Column({ nullable: true }) hovaten: string;
    @Column({ nullable: true }) SDT: string;
    @Column({ nullable: true }) diachi: string;
    @Column({ type: 'enum', enum: ['customer', 'admin'], default: 'customer' }) quyen: string;
    @Column({ type: 'enum', enum: ['active', 'inactive', 'banned'], default: 'active' }) status: string;
    @CreateDateColumn() ngay_lap: Date;
    @UpdateDateColumn() cap_nhat_ngay: Date;

    @OneToMany(() => Giohang, (g: Giohang) => g.user) giohang: Giohang[];
    @OneToMany(() => Donhang, (d: Donhang) => d.user) donhang: Donhang[];
    @OneToMany(() => Danhgia, (dg: Danhgia) => dg.user) danhgia: Danhgia[];
    @OneToMany(() => Dsyeuthich, (w: Dsyeuthich) => w.user) dsyeuthich: Dsyeuthich[];
}
