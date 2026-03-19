import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as querystring from 'node:querystring';
import moment from 'moment';
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

    async checkout(ma_user: number, dto: { dia_chi_giao: string; ten_nguoi_nhan: string; sdt_nguoi_nhan: string; phuong_thuc_TT: string; ghi_chu?: string; ma_giamgia?: string }, ipAddr: string) {
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

        const orderData = await this.findOne(order.ma_donhang);
        const plainOrder = JSON.parse(JSON.stringify(orderData));

        if (dto.phuong_thuc_TT === 'vnpay') {
            const paymentUrl = this.createVnpayUrl(order.ma_donhang, tong, ipAddr);
            return {
                ...plainOrder,
                paymentUrl
            };
        }
        return plainOrder;
    }

    createVnpayUrl(orderId: number, amount: number, ipAddr: string) {
        const tmnCode = (process.env.VNP_TMN_CODE || '').trim();
        const secretKey = (process.env.VNP_HASH_SECRET || '').trim();
        let vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURN_URL;

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');

        let vnp_Params: any = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId.toString();
        vnp_Params['vnp_OrderInfo'] = 'Thanh_toan_don_hang_' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = Math.round(Number(amount)) * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        vnp_Params = this.sortObject(vnp_Params);

        let signData = Object.keys(vnp_Params).map(key => `${key}=${vnp_Params[key]}`).join('&');
        
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        
        vnpUrl += '?' + signData + '&vnp_SecureHash=' + signed;

        return vnpUrl;
    }

    private sortObject(obj: any) {
        let sorted: any = {};
        let keys = Object.keys(obj).sort();
        for (let key of keys) {
            sorted[key] = encodeURIComponent(obj[key]);
        }
        return sorted;
    }

    async vnpayReturn(vnp_Params: any) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASH_SECRET;
        const signData = Object.keys(sortedParams)
            .map(key => `${key}=${sortedParams[key]}`)
            .join('&');
        const hmac = crypto.createHmac("sha512", secretKey || '');
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderId = parseInt(vnp_Params['vnp_TxnRef']);
            const rspCode = vnp_Params['vnp_ResponseCode'];
            if (rspCode === '00') {
                // Success
                await this.updatePaymentStatus(orderId, 'success', vnp_Params['vnp_TransactionNo']);
                return { success: true, orderId };
            } else {
                await this.updatePaymentStatus(orderId, 'failed', vnp_Params['vnp_TransactionNo']);
                return { success: false, orderId, code: rspCode };
            }
        } else {
            return { success: false, message: 'Invalid signature' };
        }
    }

    async vnpayIpn(vnp_Params: any) {
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = this.sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASH_SECRET;
        const signData = Object.keys(sortedParams)
            .map(key => `${key}=${sortedParams[key]}`)
            .join('&');
        const hmac = crypto.createHmac("sha512", secretKey || '');
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderId = parseInt(vnp_Params['vnp_TxnRef']);
            const rspCode = vnp_Params['vnp_ResponseCode'];
            
            const order = await this.orderRepo.findOne({ where: { ma_donhang: orderId }, relations: ['thanhtoan'] });
            if (!order) return { RspCode: '01', Message: 'Order not found' };

            // Check amount if needed
            // if (order.tong_tien * 100 !== parseInt(vnp_Params['vnp_Amount'])) return { RspCode: '04', Message: 'Invalid amount' };

            if (order.trang_thai_TT !== 'pending') return { RspCode: '02', Message: 'Order already confirmed' };

            if (rspCode === '00') {
                await this.updatePaymentStatus(orderId, 'success', vnp_Params['vnp_TransactionNo']);
            } else {
                await this.updatePaymentStatus(orderId, 'failed', vnp_Params['vnp_TransactionNo']);
            }
            return { RspCode: '00', Message: 'Success' };
        } else {
            return { RspCode: '97', Message: 'Invalid checksum' };
        }
    }

    async updatePaymentStatus(orderId: number, status: 'success' | 'failed', transactionNo?: string) {
        const order = await this.orderRepo.findOne({ where: { ma_donhang: orderId }, relations: ['thanhtoan'] });
        if (!order) return;

        if (status === 'success') {
            await this.orderRepo.update(orderId, { trang_thai_TT: 'paid', phuong_thuc_TT: 'vnpay' });
            if (order.thanhtoan?.length) {
                await this.ttRepo.update(order.thanhtoan[0].ma_thanhtoan, { trang_thai: 'success', ma_giao_dich: transactionNo });
            }
        } else {
            // FAILED status - keep order but mark payment failed
            if (order.thanhtoan?.length) {
                await this.ttRepo.update(order.thanhtoan[0].ma_thanhtoan, { trang_thai: 'failed', ma_giao_dich: transactionNo });
            }
        }
    }

    findMyOrders(ma_user: number) { return this.orderRepo.find({ where: { ma_user }, relations: ['chitietdonhang'], order: { ngay_dat: 'DESC' } }); }

    async findMyOrder(ma_user: number, id: number) {
        const o = await this.orderRepo.findOne({ 
            where: { ma_donhang: id, ma_user }, 
            relations: ['chitietdonhang', 'chitietdonhang.sanpham', 'chitietdonhang.sanpham.hinhanh', 'thanhtoan'] 
        });
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
