import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Danhgia } from './danhgia.entity';

@Injectable()
export class ReviewsService {
    constructor(@InjectRepository(Danhgia) private repo: Repository<Danhgia>) { }

    findByProduct(ma_sanpham: number) { return this.repo.find({ where: { ma_sanpham, trang_thai: 'approved' }, relations: ['user'], order: { ngay_lap: 'DESC' } }); }
    findMyReviews(ma_user: number) { return this.repo.find({ where: { ma_user }, order: { ngay_lap: 'DESC' } }); }
    findAll(query: any = {}) {
        const qb = this.repo.createQueryBuilder('dg').leftJoinAndSelect('dg.sanpham', 'sp').leftJoinAndSelect('dg.user', 'u');
        if (query.trang_thai) qb.andWhere('dg.trang_thai = :tt', { tt: query.trang_thai });
        if (query.ma_sanpham) qb.andWhere('dg.ma_sanpham = :sp', { sp: query.ma_sanpham });
        return qb.orderBy('dg.ngay_lap', 'DESC').getManyAndCount();
    }

    create(ma_user: number, dto: any) { return this.repo.save(this.repo.create({ ...dto, ma_user })); }

    async update(id: number, ma_user: number, dto: any) {
        const r = await this.repo.findOne({ where: { ma_danhgia: id, ma_user, trang_thai: 'pending' } });
        if (!r) throw new NotFoundException('Không tìm thấy đánh giá hoặc đã được duyệt');
        return this.repo.save({ ...r, ...dto });
    }

    async delete(id: number, ma_user: number) { await this.repo.delete({ ma_danhgia: id, ma_user }); return { message: 'Đã xóa đánh giá' }; }
    async approve(id: number) { await this.repo.update(id, { trang_thai: 'approved' } as any); return { message: 'Đã duyệt' }; }
    async reject(id: number) { await this.repo.update(id, { trang_thai: 'rejected' } as any); return { message: 'Đã từ chối' }; }
    async adminDelete(id: number) { await this.repo.delete(id); return { message: 'Đã xóa' }; }
}
