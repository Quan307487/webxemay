import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Chitietgiohang } from './chitietgiohang.entity';

@Entity('giohang')
export class Giohang {
    @PrimaryGeneratedColumn() ma_gio: number;
    @Column({ unique: true }) ma_user: number;
    @CreateDateColumn() ngay_tao: Date;
    @ManyToOne(() => User, (u: User) => u.giohang, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'ma_user' }) user: User;
    @OneToMany(() => Chitietgiohang, (c: Chitietgiohang) => c.giohang) chitietgiohang: Chitietgiohang[];
}
