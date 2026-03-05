import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dsyeuthich } from './dsyeuthich.entity';

@Injectable()
export class WishlistService {
    constructor(@InjectRepository(Dsyeuthich) private repo: Repository<Dsyeuthich>) { }
    findAll(ma_user: number) { return this.repo.find({ where: { ma_user }, relations: ['sanpham', 'sanpham.hinhanh'], order: { ngay_lap: 'DESC' } }); }
    async toggle(ma_user: number, ma_sanpham: number) {
        const exist = await this.repo.findOne({ where: { ma_user, ma_sanpham } });
        if (exist) { await this.repo.delete(exist.ma_dsyeuthich); return { added: false }; }
        await this.repo.save(this.repo.create({ ma_user, ma_sanpham }));
        return { added: true };
    }
    remove(ma_dsyeuthich: number, ma_user: number) { return this.repo.delete({ ma_dsyeuthich, ma_user }); }
}
