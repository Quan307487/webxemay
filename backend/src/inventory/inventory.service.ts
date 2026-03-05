import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tonkho } from './tonkho.entity';

@Injectable()
export class InventoryService {
    constructor(@InjectRepository(Tonkho) private repo: Repository<Tonkho>) { }
    findAll() { return this.repo.find({ relations: ['sanpham'], order: { soluong_tonkho: 'ASC' } }); }
    async update(ma_sanpham: number, soluong_tonkho: number) {
        const exist = await this.repo.findOne({ where: { ma_sanpham } });
        if (exist) { await this.repo.update(exist.ma_tonkho, { soluong_tonkho }); return this.repo.findOne({ where: { ma_sanpham }, relations: ['sanpham'] }); }
        return this.repo.save(this.repo.create({ ma_sanpham, soluong_tonkho }));
    }
}
