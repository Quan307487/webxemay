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
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    const [doanhThuThang] = await this.orderRepo.query(`SELECT COALESCE(SUM(tong_tien), 0) as total FROM donhang WHERE trang_thai NOT IN ('cancelled', 'returned') AND ngay_dat >= ?`, [monthStart]);
    const [tongHoanTien] = await this.orderRepo.query(`SELECT COALESCE(SUM(tong_tien), 0) as total FROM donhang WHERE trang_thai = 'returned'`);
    const [tongDon] = await this.orderRepo.query(`SELECT COUNT(*) as total FROM donhang`);
    const [donDaHuy] = await this.orderRepo.query(`SELECT COUNT(*) as total FROM donhang WHERE trang_thai = 'cancelled'`);
    const [spHetHang] = await this.spRepo.query(`SELECT COUNT(*) as total FROM sanpham WHERE ton_kho = 0 AND is_active = 1`);
    const [tongSanPham] = await this.spRepo.query(`SELECT COUNT(*) as total FROM sanpham WHERE is_active = 1`);
    const [tongKhach] = await this.orderRepo.query(`SELECT COUNT(*) as total FROM users WHERE status = 'active'`);

    const bestSeller = await this.orderRepo.query(`
      SELECT sp.ma_sanpham, sp.ten_sanpham, sp.gia, SUM(ctdh.so_luong) as da_ban, 
             (SELECT image_url FROM hinhanh WHERE ma_sanpham = sp.ma_sanpham ORDER BY is_main DESC, ma_anh ASC LIMIT 1) as image_url
      FROM sanpham sp 
      LEFT JOIN chitietdonhang ctdh ON sp.ma_sanpham = ctdh.ma_sanpham
      LEFT JOIN donhang dh ON ctdh.ma_donhang = dh.ma_donhang 
      WHERE dh.trang_thai != 'cancelled' OR dh.trang_thai IS NULL
      GROUP BY sp.ma_sanpham ORDER BY da_ban DESC LIMIT 5`);

    const canhBaoKho = await this.spRepo.query(`
      SELECT ma_sanpham, ten_sanpham, ton_kho 
      FROM sanpham 
      WHERE ton_kho <= 10 AND is_active = 1 
      ORDER BY ton_kho ASC 
      LIMIT 5`);

    const rawRevenue = await this.orderRepo.query(`
      SELECT 
        DATE_FORMAT(ngay_dat, '%d/%m') as thang,
        SUM(CASE WHEN trang_thai NOT IN ('cancelled', 'returned') THEN tong_tien ELSE 0 END) as thuc_thu,
        SUM(CASE WHEN trang_thai = 'returned' THEN tong_tien ELSE 0 END) as refund
      FROM donhang 
      WHERE ngay_dat >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY thang`);

    const revenue7Days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      const match = rawRevenue.find(r => r.thang === label);
      revenue7Days.push({
        thang: label,
        thuc_thu: match ? Number(match.thuc_thu) : 0,
        refund: match ? Number(match.refund) : 0
      });
    }

    const statusDistribution = await this.orderRepo.query(`
      SELECT trang_thai as status, COUNT(*) as count 
      FROM donhang 
      GROUP BY trang_thai`);

    return {
      doanh_thu_thang: Number(doanhThuThang.total),
      tong_hoan_tien: Number(tongHoanTien.total),
      tong_don: Number(tongDon.total),
      don_da_huy: Number(donDaHuy.total),
      sp_het_hang: Number(spHetHang.total),
      tong_san_pham: Number(tongSanPham.total),
      tong_khach: Number(tongKhach.total),
      top_ban_chay: bestSeller,
      canh_bao_kho: canhBaoKho,
      doanh_thu_7_ngay: revenue7Days,
      status_distribution: statusDistribution.map((s: any) => ({
        status: s.status,
        count: Number(s.count)
      }))
    };
  }
}
