import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaKhuyenmai } from './ma-khuyenmai.entity';

@Injectable()
export class CouponsService {
    constructor(@InjectRepository(MaKhuyenmai) private repo: Repository<MaKhuyenmai>) { }
    findAll() { return this.repo.find({ order: { ngay_batdau: 'DESC' } }); }
    findActive() { return this.repo.find({ where: { is_active: 1 }, order: { ngay_batdau: 'DESC' } }); }
    async validate(ma_giamgia: string, tong_tien: number) {
        const c = await this.repo.findOne({ where: { ma_giamgia, is_active: 1 } });
        if (!c) throw new NotFoundException('Mã khuyến mãi không hợp lệ');
        const now = new Date();
        if (now < c.ngay_batdau || now > c.ngay_ketthuc) throw new BadRequestException('Mã khuyến mãi đã hết hạn');
        if (c.solandung && c.solan_hientai >= c.solandung) throw new BadRequestException('Mã đã hết lượt sử dụng');
        if (tong_tien < Number(c.don_toithieu)) throw new BadRequestException(`Đơn hàng tối thiểu ${c.don_toithieu.toLocaleString()}đ`);
        const discount = c.kieu_giamgia === 'percentage' ? Math.round(tong_tien * Number(c.giatrigiam) / 100) : Number(c.giatrigiam);
        return { ...c, so_tien_giam: Math.min(discount, tong_tien) };
    }
    create(dto: Partial<MaKhuyenmai>) { return this.repo.save(this.repo.create(dto)); }
    async update(id: number, dto: Partial<MaKhuyenmai>) { await this.repo.update(id, dto); return this.repo.findOne({ where: { ma_khuyenmai: id } }); }
}
