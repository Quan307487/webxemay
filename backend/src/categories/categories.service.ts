import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Danhmuc } from './danhmuc.entity';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Danhmuc) private repo: Repository<Danhmuc>) { }
    findAll(activeOnly = false) {
        return this.repo.find({ where: activeOnly ? { is_active: 1 } : {}, order: { ten_danhmuc: 'ASC' } });
    }
    async findOne(id: number) {
        const item = await this.repo.findOne({ where: { ma_danhmuc: id } });
        if (!item) throw new NotFoundException('Không tìm thấy danh mục');
        return item;
    }
    create(dto: Partial<Danhmuc>) { return this.repo.save(this.repo.create(dto)); }
    async update(id: number, dto: Partial<Danhmuc>) { await this.repo.update(id, dto); return this.findOne(id); }
    async remove(id: number) { await this.repo.delete(id); return { message: 'Đã xóa danh mục vĩnh viễn' }; }
}
