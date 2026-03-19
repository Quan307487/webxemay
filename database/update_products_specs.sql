-- ======================================================
-- CẬP NHẬT THÔNG SỐ KỸ THUẬT ĐẦY ĐỦ CHO TẤT CẢ XE MÁY
-- Chạy lệnh: mysql -u root -p webxemay < update_products_specs.sql
-- ======================================================
USE webxemay;

-- -------------------
-- ID 1: Honda Wave Alpha 110
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Honda Wave Alpha 110 là dòng xe số bền bỉ, tiết kiệm nhiên liệu vượt trội, phù hợp với mọi địa hình. Thiết kế thanh lịch, vận hành êm ái là lựa chọn hàng đầu của người Việt.',
    kieu_xe = 'xe_so',
    loai_nhien_lieu = 'xang',
    hop_so = 'so_tay',
    he_thong_phanhang = 'trong',
    he_thong_khoi_dong = 'ca_hai',
    dung_tich_dong_co = '110cc',
    loai_dong_co = '4 kỳ, SOHC, 2 van, làm mát bằng không khí',
    muc_tieu_thu = '1.73L/100km',
    cong_suat_toi_da = '6.34 kW (8.6 PS) / 7500 rpm',
    momen_xoan_toi_da = '8.5 Nm / 5500 rpm',
    trong_luong_kho = 95,
    kich_thuoc = '1919 x 718 x 1073',
    chieu_cao_yen = 762,
    dung_tich_binh_xang = 3.7,
    kich_co_lop_truoc = '70/90-17 M/C 38P',
    kich_co_lop_sau = '80/90-17 M/C 50P',
    nam_san_xuat = 2024,
    mau_sac = 'Đỏ/Đen, Vàng/Đen, Xanh Dương/Bạc',
    xuat_xu = 'Lắp ráp tại Việt Nam (Honda Việt Nam)'
WHERE ma_sanpham = 1;

-- -------------------
-- ID 2: Honda Vision 2025
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Honda Vision 2025 – xe ga thông minh, thiết kế hiện đại với đèn LED toàn phần, phanh CBS đồng bộ và không gian chứa đồ rộng rãi. Đồng hành hoàn hảo cho đô thị.',
    kieu_xe = 'xe_ga',
    loai_nhien_lieu = 'xang',
    hop_so = 'tu_dong',
    he_thong_phanhang = 'trong',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = '110cc',
    loai_dong_co = '4 kỳ, eSP+, SOHC, 2 van, làm mát bằng không khí',
    muc_tieu_thu = '1.87L/100km',
    cong_suat_toi_da = '6.0 kW (8.16 PS) / 8000 rpm',
    momen_xoan_toi_da = '8.68 Nm / 5500 rpm',
    trong_luong_kho = 102,
    kich_thuoc = '1909 x 679 x 1102',
    chieu_cao_yen = 764,
    dung_tich_binh_xang = 4.2,
    kich_co_lop_truoc = '80/90-14 M/C 40P',
    kich_co_lop_sau = '90/90-14 M/C 46P',
    nam_san_xuat = 2025,
    mau_sac = 'Đỏ Ánh Kim, Đen Mờ, Xanh Dương, Trắng Ngọc Trai',
    xuat_xu = 'Lắp ráp tại Việt Nam (Honda Việt Nam)'
WHERE ma_sanpham = 2;

-- -------------------
-- ID 3: Yamaha Exciter 155 VVA
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Yamaha Exciter 155 VVA – biểu tượng côn tay đường phố với công nghệ van biến thiên VVA, mạnh mẽ vượt trội, kiểu dáng thể thao đỉnh cao. Siêu phẩm của giới trẻ năng động.',
    kieu_xe = 'xe_con_tay',
    loai_nhien_lieu = 'xang',
    hop_so = 'so_tay',
    he_thong_phanhang = 'dia',
    he_thong_khoi_dong = 'ca_hai',
    dung_tich_dong_co = '155cc',
    loai_dong_co = '4 kỳ, SOHC, VVA (Variable Valve Actuation), làm mát bằng chất lỏng',
    muc_tieu_thu = '2.17L/100km',
    cong_suat_toi_da = '12.0 kW (16.3 PS) / 9500 rpm',
    momen_xoan_toi_da = '14.7 Nm / 8500 rpm',
    trong_luong_kho = 129,
    kich_thuoc = '1985 x 680 x 1070',
    chieu_cao_yen = 790,
    dung_tich_binh_xang = 4.6,
    kich_co_lop_truoc = '100/70-17 M/C 50P',
    kich_co_lop_sau = '120/70-17 M/C 58P',
    nam_san_xuat = 2024,
    mau_sac = 'Xanh GP, Đen Nhám, Đỏ Xám, Trắng Đen',
    xuat_xu = 'Lắp ráp tại Việt Nam (Yamaha Motor Việt Nam)'
WHERE ma_sanpham = 3;

-- -------------------
-- ID 4: Yamaha Janus Standard
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Yamaha Janus – xe ga 125cc dành cho phái nữ với thiết kế thanh lịch, nhẹ nhàng. Hệ thống đèn LED tinh tế, không gian gầm yên rộng rãi, lý tưởng cho hành trình đô thị.',
    kieu_xe = 'xe_ga',
    loai_nhien_lieu = 'xang',
    hop_so = 'tu_dong',
    he_thong_phanhang = 'trong',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = '125cc',
    loai_dong_co = '4 kỳ, SOHC, Blue Core, làm mát bằng không khí',
    muc_tieu_thu = '1.84L/100km',
    cong_suat_toi_da = '6.75 kW (9.17 PS) / 8000 rpm',
    momen_xoan_toi_da = '9.6 Nm / 5500 rpm',
    trong_luong_kho = 97,
    kich_thuoc = '1820 x 695 x 1060',
    chieu_cao_yen = 747,
    dung_tich_binh_xang = 3.7,
    kich_co_lop_truoc = '80/90-14 M/C 40P',
    kich_co_lop_sau = '90/90-14 M/C 46P',
    nam_san_xuat = 2024,
    mau_sac = 'Trắng Ngọc Trai, Đen Bóng, Hồng Pastel, Xanh Ngọc',
    xuat_xu = 'Lắp ráp tại Việt Nam (Yamaha Motor Việt Nam)'
WHERE ma_sanpham = 4;

-- -------------------
-- ID 5: VinFast Feliz S
-- -------------------
UPDATE sanpham SET
    mo_ta = 'VinFast Feliz S – xe máy điện thông minh Made-in-Vietnam với kết nối app, hệ thống chống trộm GPS tích hợp và phạm vi hành trình ấn tượng. Xe xanh cho tương lai sạch hơn.',
    kieu_xe = 'xe_dien',
    loai_nhien_lieu = 'dien',
    hop_so = 'khong_hop_so',
    he_thong_phanhang = 'dia',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = NULL,
    loai_dong_co = 'Động cơ điện BLDC 3000W',
    muc_tieu_thu = '2.0 kWh/100km',
    cong_suat_toi_da = '3.0 kW (liên tục) / 5.0 kW (đỉnh)',
    momen_xoan_toi_da = '38 Nm (điện)',
    cong_suat_pin = '1.9 kWh - Pin Lithium (tháo rời)',
    pham_vi_hanh_trinh = '120-160 km (điều kiện đô thị)',
    trong_luong_kho = 83,
    kich_thuoc = '1803 x 680 x 1041',
    chieu_cao_yen = 757,
    dung_tich_binh_xang = NULL,
    kich_co_lop_truoc = '90/90-12 M/C 44J',
    kich_co_lop_sau = '100/90-12 M/C 60J',
    nam_san_xuat = 2024,
    mau_sac = 'Đen Nhám, Xám Xanh, Trắng Sứ, Đỏ Đô',
    xuat_xu = 'Sản xuất tại Việt Nam (VinFast)'
WHERE ma_sanpham = 5;

-- -------------------
-- ID 6: VinFast Theon S
-- -------------------
UPDATE sanpham SET
    mo_ta = 'VinFast Theon S – xe ga điện cao cấp với sức mạnh vượt trội, công nghệ kết nối thông minh và thiết kế premium. Đỉnh cao của xe điện Việt Nam dành cho phân khúc cao cấp.',
    kieu_xe = 'xe_ga',
    loai_nhien_lieu = 'dien',
    hop_so = 'khong_hop_so',
    he_thong_phanhang = 'abs',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = NULL,
    loai_dong_co = 'Động cơ điện BLDC 7100W',
    muc_tieu_thu = '3.2 kWh/100km',
    cong_suat_toi_da = '7.1 kW (liên tục) / 9.5 kW (đỉnh)',
    momen_xoan_toi_da = '65 Nm (điện)',
    cong_suat_pin = '4.1 kWh - Pin Lithium NMC (tích hợp)',
    pham_vi_hanh_trinh = '170-210 km (đô thị) / 100 km (cao tốc)',
    trong_luong_kho = 128,
    kich_thuoc = '1985 x 780 x 1155',
    chieu_cao_yen = 785,
    dung_tich_binh_xang = NULL,
    kich_co_lop_truoc = '120/70-14 M/C 55S',
    kich_co_lop_sau = '150/70-14 M/C 66S',
    nam_san_xuat = 2024,
    mau_sac = 'Xám Xi Măng, Đen Bóng, Trắng Luxembourg',
    xuat_xu = 'Sản xuất tại Việt Nam (VinFast)'
WHERE ma_sanpham = 6;

-- -------------------
-- ID 7: Kawasaki Ninja ZX-10R
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Kawasaki Ninja ZX-10R – siêu xe đường đua 1000cc tầm thế giới, tham chiến MotoGP. Trang bị ABS Cornering, traction control, hệ thống lái điện tử thế hệ mới. Đẳng cấp thuần chủng đường đua.',
    kieu_xe = 'phan_khoi_lon',
    loai_nhien_lieu = 'xang',
    hop_so = 'so_tay',
    he_thong_phanhang = 'abs',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = '998cc',
    loai_dong_co = '4 kỳ, DOHC, 16 van, 4 xylanh hàng ngang, làm mát bằng chất lỏng',
    muc_tieu_thu = '6.8L/100km',
    cong_suat_toi_da = '147 kW (200 PS) / 13200 rpm',
    momen_xoan_toi_da = '113 Nm / 11400 rpm',
    trong_luong_kho = 207,
    kich_thuoc = '2085 x 750 x 1185',
    chieu_cao_yen = 835,
    dung_tich_binh_xang = 17.0,
    kich_co_lop_truoc = '120/70 ZR17 M/C 58W',
    kich_co_lop_sau = '190/55 ZR17 M/C 75W',
    nam_san_xuat = 2023,
    mau_sac = 'Xanh Lime / Đen (KRT Edition), Đen Nhám',
    xuat_xu = 'Nhập khẩu từ Nhật Bản (Kawasaki Heavy Industries)'
WHERE ma_sanpham = 7;

-- -------------------
-- ID 8: Kawasaki Z900 ABS
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Kawasaki Z900 ABS – naked bike cơ bắp với kiểu dáng Sugomi độc đáo. Động cơ 948cc mạnh mẽ, ABS thế hệ mới, đèn LED trang bị toàn phần. Siêu phẩm streetfighter đẳng cấp.',
    kieu_xe = 'phan_khoi_lon',
    loai_nhien_lieu = 'xang',
    hop_so = 'so_tay',
    he_thong_phanhang = 'abs',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = '948cc',
    loai_dong_co = '4 kỳ, DOHC, 16 van, 4 xylanh hàng ngang, làm mát bằng chất lỏng',
    muc_tieu_thu = '5.5L/100km',
    cong_suat_toi_da = '92 kW (125 PS) / 9500 rpm',
    momen_xoan_toi_da = '98.6 Nm / 7700 rpm',
    trong_luong_kho = 193,
    kich_thuoc = '2070 x 775 x 1090',
    chieu_cao_yen = 795,
    dung_tich_binh_xang = 17.0,
    kich_co_lop_truoc = '120/70 ZR17 M/C 58W',
    kich_co_lop_sau = '180/55 ZR17 M/C 73W',
    nam_san_xuat = 2023,
    mau_sac = 'Xám Ngọc / Đen (Metallic Spark Black), Xanh Dương,Vàng',
    xuat_xu = 'Nhập khẩu từ Thái Lan (Kawasaki Motors)'
WHERE ma_sanpham = 8;

-- -------------------
-- ID 9: Piaggio Vespa Sprint 125
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Piaggio Vespa Sprint 125 – biểu tượng thời trang Ý hơn 75 năm lịch sử. Khung thép nguyên khối, động cơ i-GET fuel injection mạnh mẽ và tiết kiệm. Phong cách, cổ điển, đẳng cấp.',
    kieu_xe = 'xe_ga',
    loai_nhien_lieu = 'xang',
    hop_so = 'tu_dong',
    he_thong_phanhang = 'abs',
    he_thong_khoi_dong = 'de_dien',
    dung_tich_dong_co = '125cc',
    loai_dong_co = '4 kỳ, SOHC, 3 van, i-GET (Injection, Green, Efficient Technology), làm mát bằng không khí',
    muc_tieu_thu = '2.8L/100km',
    cong_suat_toi_da = '7.4 kW (10.05 PS) / 7750 rpm',
    momen_xoan_toi_da = '10.1 Nm / 5000 rpm',
    trong_luong_kho = 128,
    kich_thuoc = '1760 x 740 x 1145',
    chieu_cao_yen = 790,
    dung_tich_binh_xang = 7.4,
    kich_co_lop_truoc = '110/70-12 M/C 47P',
    kich_co_lop_sau = '120/70-12 M/C 51P',
    nam_san_xuat = 2024,
    mau_sac = 'Vàng Cát, Xanh Gió, Nero Vulcano, Bianco Innocente, Rosso Dragon',
    xuat_xu = 'Nhập khẩu từ Ý (Piaggio & C. SpA)'
WHERE ma_sanpham = 9;

-- -------------------
-- ID 10: Suzuki Raider R150
-- -------------------
UPDATE sanpham SET
    mo_ta = 'Suzuki Raider R150 – côn tay 150cc đỉnh cao với phun xăng điện tử, phanh đĩa 2 bánh và hệ thống treo thể thao. Thiết kế agressive mang phong cách đường đua cho giới trẻ.',
    kieu_xe = 'xe_con_tay',
    loai_nhien_lieu = 'xang',
    hop_so = 'so_tay',
    he_thong_phanhang = 'dia',
    he_thong_khoi_dong = 'ca_hai',
    dung_tich_dong_co = '147.3cc',
    loai_dong_co = '4 kỳ, SOHC, 4 van, phun xăng điện tử (EFI), làm mát bằng chất lỏng',
    muc_tieu_thu = '2.27L/100km',
    cong_suat_toi_da = '10.7 kW (14.5 PS) / 10000 rpm',
    momen_xoan_toi_da = '13.8 Nm / 8000 rpm',
    trong_luong_kho = 118,
    kich_thuoc = '1975 x 695 x 1060',
    chieu_cao_yen = 790,
    dung_tich_binh_xang = 10.0,
    kich_co_lop_truoc = '70/90-17 M/C 38P',
    kich_co_lop_sau = '80/90-17 M/C 50P',
    nam_san_xuat = 2024,
    mau_sac = 'Đỏ Đen, Xanh Đen, Trắng Đen',
    xuat_xu = 'Nhập khẩu từ Thái Lan (Thai Suzuki Motor)'
WHERE ma_sanpham = 10;

-- Hiển thị kết quả sau khi cập nhật
SELECT ma_sanpham, ten_sanpham, kieu_xe, dung_tich_dong_co, muc_tieu_thu, cong_suat_toi_da, nam_san_xuat, mau_sac
FROM sanpham
ORDER BY ma_sanpham;
