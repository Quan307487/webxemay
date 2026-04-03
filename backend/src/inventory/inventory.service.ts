import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tonkho } from './tonkho.entity';
import { Sanpham } from '../products/sanpham.entity';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(Tonkho) private repo: Repository<Tonkho>,
        @InjectRepository(Sanpham) private spRepo: Repository<Sanpham>
    ) { }

    async findAll() {
        const rows = await this.repo.query(`
            SELECT 
                sp.ma_sanpham,
                sp.ten_sanpham,
                sp.kieu_xe,
                tk.ma_tonkho,
                COALESCE(tk.soluong_tonkho, sp.ton_kho, 0) AS soluong_tonkho,
                tk.ngay_cap_nhat
            FROM sanpham sp
            LEFT JOIN tonkho tk ON sp.ma_sanpham = tk.ma_sanpham
            ORDER BY sp.ma_sanpham DESC
        `);
        return rows;
    }

    async update(ma_sanpham: number, soluong_tonkho: number) {
        const exist = await this.repo.findOne({ where: { ma_sanpham } });
        if (exist) {
            await this.repo.update(exist.ma_tonkho, { soluong_tonkho });
        } else {
            await this.repo.save(this.repo.create({ ma_sanpham, soluong_tonkho }));
        }
        // Đồng bộ luôn cột ton_kho trong bảng sanpham
        await this.spRepo.update(ma_sanpham, { ton_kho: soluong_tonkho } as any);
        return { ma_sanpham, soluong_tonkho };
    }

    async deleteAll() {
        await this.repo.query('SET FOREIGN_KEY_CHECKS = 0');
        await this.repo.query('TRUNCATE TABLE tonkho');
        await this.repo.query('SET FOREIGN_KEY_CHECKS = 1');
        return { message: 'Đã dọn sạch tồn kho' };
    }
}
