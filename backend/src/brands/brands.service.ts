import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thuonghieu } from './thuonghieu.entity';

@Injectable()
export class BrandsService {
    constructor(@InjectRepository(Thuonghieu) private repo: Repository<Thuonghieu>) { }
    findAll(activeOnly = false) { return this.repo.find({ where: activeOnly ? { is_active: 1 } : {}, order: { ten_thuonghieu: 'ASC' } }); }
    async findOne(id: number) { const item = await this.repo.findOne({ where: { ma_thuonghieu: id } }); if (!item) throw new NotFoundException('Không tìm thấy thương hiệu'); return item; }
    create(dto: Partial<Thuonghieu>) { return this.repo.save(this.repo.create(dto)); }
    async update(id: number, dto: Partial<Thuonghieu>) { await this.repo.update(id, dto); return this.findOne(id); }
    async remove(id: number) { await this.repo.delete(id); return { message: 'Đã xóa thương hiệu vĩnh viễn' }; }
}
