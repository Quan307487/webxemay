import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Sanpham } from '../products/sanpham.entity';

@Entity('dsyeuthich')
export class Dsyeuthich {
    @PrimaryGeneratedColumn() ma_dsyeuthich: number;
    @Column() ma_user: number;
    @Column() ma_sanpham: number;
    @CreateDateColumn() ngay_lap: Date;
    @ManyToOne(() => User, (u: User) => u.dsyeuthich, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_user' }) user: User;
    @ManyToOne(() => Sanpham, (s: Sanpham) => s.dsyeuthich, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_sanpham' }) sanpham: Sanpham;
}
