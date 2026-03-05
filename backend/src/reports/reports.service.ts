import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donhang } from '../orders/donhang.entity';
import { Sanpham } from '../products/sanpham.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Donhang) private orderRepo: Repository<Donhang>,
    @InjectRepository(Sanpham) private spRepo: Repository<Sanpham>,
  ) { }

  async getDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const month = new Date(today.getFullYear(), today.getMonth(), 1);
    const [doanhThuThang] = await this.orderRepo.query(`SELECT COALESCE(SUM(tong_tien),0) as total FROM donhang WHERE trang_thai != 'cancelled' AND ngay_dat >= ?`, [month]);
    const [tongDon] = await this.orderRepo.query(`SELECT COUNT(*) as total FROM donhang`);
    const [donHom] = await this.orderRepo.query(`SELECT COUNT(*) as total FROM donhang WHERE ngay_dat >= ?`, [today]);
    const [spHetHang] = await this.spRepo.query(`SELECT COUNT(*) as total FROM sanpham WHERE ton_kho = 0 AND is_active = 1`);
    const bestSeller = await this.orderRepo.query(`
      SELECT sp.ma_sanpham, sp.ten_sanpham, sp.gia, SUM(ctdh.so_luong) as da_ban
      FROM sanpham sp JOIN chitietdonhang ctdh ON sp.ma_sanpham = ctdh.ma_sanpham
      JOIN donhang dh ON ctdh.ma_donhang = dh.ma_donhang WHERE dh.trang_thai != 'cancelled'
      GROUP BY sp.ma_sanpham ORDER BY da_ban DESC LIMIT 10`);
    const revenueByMonth = await this.orderRepo.query(`
      SELECT 
        DATE_FORMAT(ngay_dat, '%Y-%m') as thang,
        SUM(CASE WHEN trang_thai NOT IN ('cancelled', 'returned') THEN tong_tien ELSE 0 END) as thuc_thu,
        SUM(CASE WHEN trang_thai = 'returned' THEN tong_tien ELSE 0 END) as refund,
        SUM(tong_tien) as doanh_thu,
        COUNT(*) as so_don
      FROM donhang 
      GROUP BY thang 
      ORDER BY thang DESC 
      LIMIT 12`);

    const statusDistribution = await this.orderRepo.query(`
      SELECT trang_thai as status, COUNT(*) as count 
      FROM donhang 
      GROUP BY trang_thai`);

    return {
      doanh_thu_thang: doanhThuThang.total,
      tong_don: tongDon.total,
      don_hom_nay: donHom.total,
      sp_het_hang: spHetHang.total,
      top_ban_chay: bestSeller,
      doanh_thu_theo_thang: revenueByMonth.reverse(),
      status_distribution: statusDistribution
    };
  }
}
