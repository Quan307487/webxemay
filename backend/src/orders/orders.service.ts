import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donhang } from './donhang.entity';
import { Chitietdonhang } from './chitietdonhang.entity';
import { Sanpham } from '../products/sanpham.entity';
import { Giohang } from '../cart/giohang.entity';
import { Chitietgiohang } from '../cart/chitietgiohang.entity';
import { Thanhtoan } from '../payments/thanhtoan.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Donhang) private orderRepo: Repository<Donhang>,
        @InjectRepository(Chitietdonhang) private itemRepo: Repository<Chitietdonhang>,
        @InjectRepository(Sanpham) private spRepo: Repository<Sanpham>,
        @InjectRepository(Giohang) private cartRepo: Repository<Giohang>,
        @InjectRepository(Chitietgiohang) private cartItemRepo: Repository<Chitietgiohang>,
        @InjectRepository(Thanhtoan) private ttRepo: Repository<Thanhtoan>,
    ) { }

    async checkout(ma_user: number, dto: { dia_chi_giao: string; ten_nguoi_nhan: string; sdt_nguoi_nhan: string; phuong_thuc_TT: string; ghi_chu?: string; ma_giamgia?: string }) {
        const cart = await this.cartRepo.findOne({ where: { ma_user }, relations: ['chitietgiohang', 'chitietgiohang.sanpham'] });
        if (!cart?.chitietgiohang?.length) throw new BadRequestException('Giỏ hàng trống');
        // Kiểm tra tồn kho
        for (const item of cart.chitietgiohang) {
            if (item.sanpham.ton_kho < item.so_luong) throw new BadRequestException(`Sản phẩm ${item.sanpham.ten_sanpham} chỉ còn ${item.sanpham.ton_kho} xe`);
        }
        const code = `XM-${Date.now()}`;
        const tong = cart.chitietgiohang.reduce((s, i) => s + Number(i.gia_hien_tai) * i.so_luong, 0);
        const order = await this.orderRepo.save(this.orderRepo.create({ ...dto, ma_user, donhang_code: code, tong_tien: tong, phuong_thuc_TT: dto.phuong_thuc_TT as any }));
        for (const item of cart.chitietgiohang) {
            await this.itemRepo.save(this.itemRepo.create({ ma_donhang: order.ma_donhang, ma_sanpham: item.ma_sanpham, ten_sanpham: item.sanpham.ten_sanpham, so_luong: item.so_luong, don_gia: item.gia_hien_tai, thanh_tien: Number(item.gia_hien_tai) * item.so_luong, mau_xe: item.mau_chon }));
            await this.spRepo.decrement({ ma_sanpham: item.ma_sanpham }, 'ton_kho', item.so_luong);
        }
        await this.cartItemRepo.delete({ ma_gio: cart.ma_gio });
        await this.ttRepo.save(this.ttRepo.create({ ma_donhang: order.ma_donhang, thanh_tien: tong, PT_thanhtoan: dto.phuong_thuc_TT as any, ma_giamgia: dto.ma_giamgia }));
        return this.findOne(order.ma_donhang);
    }

    findMyOrders(ma_user: number) { return this.orderRepo.find({ where: { ma_user }, relations: ['chitietdonhang'], order: { ngay_dat: 'DESC' } }); }

    async findMyOrder(ma_user: number, id: number) {
        const o = await this.orderRepo.findOne({ where: { ma_donhang: id, ma_user }, relations: ['chitietdonhang', 'thanhtoan'] });
        if (!o) throw new NotFoundException('Không tìm thấy đơn hàng');
        return o;
    }

    findAll(query: any = {}) {
        const qb = this.orderRepo.createQueryBuilder('dh')
            .leftJoinAndSelect('dh.user', 'u')
            .leftJoinAndSelect('dh.chitietdonhang', 'ctdh')
            .leftJoinAndSelect('ctdh.sanpham', 'sp')
            .leftJoinAndSelect('sp.hinhanh', 'ha');
        if (query.trang_thai) qb.andWhere('dh.trang_thai = :tt', { tt: query.trang_thai });
        if (query.ma_user) qb.andWhere('dh.ma_user = :uid', { uid: query.ma_user });
        if (query.search) {
            qb.andWhere(
                '(dh.donhang_code LIKE :s OR u.hovaten LIKE :s OR u.ten_user LIKE :s OR dh.ten_nguoi_nhan LIKE :s OR dh.sdt_nguoi_nhan LIKE :s)',
                { s: `%${query.search}%` }
            );
        }
        return qb.orderBy('dh.ngay_dat', 'DESC').getManyAndCount();
    }

    async findOne(id: number) {
        const o = await this.orderRepo.findOne({ where: { ma_donhang: id }, relations: ['chitietdonhang', 'chitietdonhang.sanpham', 'chitietdonhang.sanpham.hinhanh', 'user', 'thanhtoan'] });
        if (!o) throw new NotFoundException('Không tìm thấy đơn hàng');
        return o;
    }

    async updateStatus(id: number, trang_thai: string) {
        const order = await this.findOne(id);
        const updateData: any = { trang_thai };

        // Logic đồng bộ trạng thái thanh toán theo trạng thái đơn hàng
        if (trang_thai === 'delivered') {
            updateData.day_thuc_te = new Date();
            updateData.trang_thai_TT = 'paid';
            if (order.thanhtoan?.length) {
                for (const tt of order.thanhtoan) {
                    await this.ttRepo.update(tt.ma_thanhtoan, { trang_thai: 'success' });
                }
            }
        } else if (trang_thai === 'cancelled') {
            updateData.trang_thai_TT = 'failed';
            if (order.thanhtoan?.length) {
                for (const tt of order.thanhtoan) {
                    await this.ttRepo.update(tt.ma_thanhtoan, { trang_thai: 'failed' });
                }
            }
        } else if (trang_thai === 'returned') {
            updateData.trang_thai_TT = 'refunded';
            if (order.thanhtoan?.length) {
                for (const tt of order.thanhtoan) {
                    await this.ttRepo.update(tt.ma_thanhtoan, { trang_thai: 'refunded' });
                }
            }
        }

        await this.orderRepo.update(id, updateData);
        return this.findOne(id);
    }
}
