import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Giohang } from './giohang.entity';
import { Chitietgiohang } from './chitietgiohang.entity';
import { Sanpham } from '../products/sanpham.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Giohang) private cartRepo: Repository<Giohang>,
        @InjectRepository(Chitietgiohang) private itemRepo: Repository<Chitietgiohang>,
        @InjectRepository(Sanpham) private productRepo: Repository<Sanpham>,
    ) { }

    async getOrCreateCart(ma_user: number) {
        let cart = await this.cartRepo.findOne({ where: { ma_user }, relations: ['chitietgiohang', 'chitietgiohang.sanpham', 'chitietgiohang.sanpham.hinhanh'] });
        if (!cart) { cart = await this.cartRepo.save(this.cartRepo.create({ ma_user })); cart.chitietgiohang = []; }
        return cart;
    }

    async addItem(ma_user: number, ma_sanpham: number, so_luong: number, mau_chon?: string) {
        const sp = await this.productRepo.findOne({ where: { ma_sanpham, is_active: 1 } });
        if (!sp) throw new NotFoundException('Sản phẩm không tồn tại');
        if (sp.ton_kho < so_luong) throw new BadRequestException(`Chỉ còn ${sp.ton_kho} xe trong kho`);
        const cart = await this.getOrCreateCart(ma_user);
        
        // Tìm mục đã tồn tại khớp cả ID sản phẩm và màu sắc
        const exist = await this.itemRepo.findOne({ 
            where: { 
                ma_gio: cart.ma_gio, 
                ma_sanpham, 
                mau_chon: (mau_chon || IsNull()) as any
            } 
        });

        if (exist) {
            const newQty = exist.so_luong + so_luong;
            if (sp.ton_kho < newQty) throw new BadRequestException(`Chỉ còn ${sp.ton_kho} xe trong kho`);
            await this.itemRepo.update(exist.ma_CTGH, { so_luong: newQty });
        } else {
            const gia = this.calcPrice(sp);
            await this.itemRepo.save(this.itemRepo.create({ ma_gio: cart.ma_gio, ma_sanpham, so_luong, gia_hien_tai: gia, mau_chon }));
        }
        return this.getOrCreateCart(ma_user);
    }

    async updateItem(ma_user: number, ma_CTGH: number, so_luong: number) {
        const item = await this.itemRepo.findOne({ where: { ma_CTGH } });
        if (!item) throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ');
        const sp = await this.productRepo.findOne({ where: { ma_sanpham: item.ma_sanpham } });
        if (!sp) throw new NotFoundException('Sản phẩm không tồn tại');
        if (sp.ton_kho < so_luong) throw new BadRequestException(`Chỉ còn ${sp.ton_kho} xe trong kho`);
        if (so_luong <= 0) { await this.itemRepo.delete(ma_CTGH); } else { await this.itemRepo.update(ma_CTGH, { so_luong }); }
        return this.getOrCreateCart(ma_user);
    }

    async removeItem(ma_user: number, ma_CTGH: number) {
        await this.itemRepo.delete(ma_CTGH);
        return this.getOrCreateCart(ma_user);
    }

    async clearCart(ma_user: number) {
        const cart = await this.cartRepo.findOne({ where: { ma_user } });
        if (cart) await this.itemRepo.delete({ ma_gio: cart.ma_gio });
        return { message: 'Đã xóa giỏ hàng' };
    }

    private calcPrice(sp: Sanpham): number {
        if (!sp.gia_tri_giam || sp.gia_tri_giam == 0) return Number(sp.gia);
        if (sp.kieu_giam_gia === 'percentage') return Math.round(Number(sp.gia) * (1 - Number(sp.gia_tri_giam) / 100));
        return Math.round(Number(sp.gia) - Number(sp.gia_tri_giam));
    }
}
