import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sanpham } from './sanpham.entity';
import { Hinhanh } from './hinhanh.entity';
import { Tonkho } from '../inventory/tonkho.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Sanpham) private repo: Repository<Sanpham>,
        @InjectRepository(Hinhanh) private imgRepo: Repository<Hinhanh>,
        @InjectRepository(Tonkho) private tonkhoRepo: Repository<Tonkho>,
    ) { }

    findAll(query: any = {}) {
        const qb = this.repo.createQueryBuilder('sp')
            .leftJoinAndSelect('sp.danhmuc', 'dm')
            .leftJoinAndSelect('sp.thuonghieu', 'th')
            .leftJoinAndSelect('sp.hinhanh', 'ha');
        if (query.active !== 'false') qb.andWhere('sp.is_active = 1');
        if (query.ma_danhmuc) qb.andWhere('sp.ma_danhmuc = :dm', { dm: query.ma_danhmuc });
        if (query.ma_thuonghieu) qb.andWhere('sp.ma_thuonghieu = :th', { th: query.ma_thuonghieu });
        if (query.kieu_xe) qb.andWhere('sp.kieu_xe = :kx', { kx: query.kieu_xe });
        if (query.loai_nhien_lieu) qb.andWhere('sp.loai_nhien_lieu = :nl', { nl: query.loai_nhien_lieu });
        if (query.gia_min) qb.andWhere('sp.gia >= :gmin', { gmin: query.gia_min });
        if (query.gia_max) qb.andWhere('sp.gia <= :gmax', { gmax: query.gia_max });
        if (query.search) qb.andWhere('sp.ten_sanpham LIKE :s', { s: `%${query.search}%` });
        if (query.has_discount === '1') qb.andWhere('sp.gia_tri_giam > 0');
        // Whitelist sort columns to prevent SQL injection
        const allowedSorts = ['ngay_lap', 'gia', 'diem_danh_gia', 'ten_sanpham'];
        const sort = allowedSorts.includes(query.sort) ? query.sort : 'ngay_lap';
        const dir = query.dir === 'ASC' ? 'ASC' : 'DESC';
        qb.orderBy(`sp.${sort}`, dir);
        if (query.limit) qb.limit(Number(query.limit));
        if (query.offset) qb.offset(Number(query.offset));
        return qb.getManyAndCount();
    }

    async findOne(id: number) {
        const item = await this.repo.findOne({ where: { ma_sanpham: id }, relations: ['danhmuc', 'thuonghieu', 'hinhanh'] });
        if (!item) throw new NotFoundException('Không tìm thấy sản phẩm');
        return item;
    }

    async create(dto: Partial<Sanpham>) {
        const sanpham = await this.repo.save(this.repo.create(dto));
        // Tự động tạo bản ghi tồn kho với số lượng ban đầu từ ton_kho của sản phẩm
        const initialQty = (dto as any).ton_kho || 0;
        await this.tonkhoRepo.save(this.tonkhoRepo.create({
            ma_sanpham: sanpham.ma_sanpham,
            soluong_tonkho: initialQty
        }));
        return sanpham;
    }

    async update(id: number, dto: Partial<Sanpham>) { await this.repo.update(id, dto); return this.findOne(id); }

    async remove(id: number) { await this.repo.delete(id); return { message: 'Đã xóa sản phẩm vĩnh viễn' }; }

    async addImage(ma_sanpham: number, image_url: string, is_main = false, mo_ta_anh?: string) {
        if (is_main) await this.imgRepo.update({ ma_sanpham }, { is_main: 0 } as any);
        return this.imgRepo.save(this.imgRepo.create({ ma_sanpham, image_url, is_main: is_main ? 1 : 0, mo_ta_anh }));
    }

    async removeImage(ma_anh: number) { await this.imgRepo.delete(ma_anh); return { message: 'Đã xóa ảnh' }; }

    async updateImage(ma_anh: number, dto: Partial<Hinhanh>) {
        await this.imgRepo.update(ma_anh, dto as any);
        return { message: 'Đã cập nhật ảnh' };
    }

    async setMainImage(ma_sanpham: number, ma_anh: number) {
        await this.imgRepo.update({ ma_sanpham }, { is_main: 0 } as any);
        await this.imgRepo.update(ma_anh, { is_main: 1 } as any);
        return { message: 'Đã đặt ảnh chính' };
    }
}
