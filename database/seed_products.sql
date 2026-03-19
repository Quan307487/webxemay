USE webxemay;

-- SEED PRODUCTS
INSERT INTO sanpham (ten_sanpham, sanpham_code, ma_danhmuc, ma_thuonghieu, gia, kieu_xe, dung_tich_dong_co, loai_nhien_lieu, ton_kho, is_active, diem_danh_gia) VALUES
('Honda Wave Alpha 110', 'HD-WAVE-110', 1, 1, 18000000, 'xe_so', '110cc', 'xang', 50, 1, 4.5),
('Honda Vision 2025', 'HD-VISION-2025', 2, 1, 32000000, 'xe_ga', '110cc', 'xang', 30, 1, 4.8),
('Yamaha Exciter 155 VVA', 'YM-EXCITER-155', 3, 2, 48000000, 'xe_con_tay', '155cc', 'xang', 20, 1, 4.7),
('Yamaha Janus Standard', 'YM-JANUS-STD', 2, 2, 29000000, 'xe_ga', '125cc', 'xang', 15, 1, 4.2),
('VinFast Feliz S', 'VF-FELIZ-S', 4, 6, 27000000, 'xe_dien', '3000W', 'dien', 40, 1, 4.6),
('VinFast Theon S', 'VF-THEON-S', 4, 6, 63000000, 'xe_dien', '7100W', 'dien', 10, 1, 4.9),
('Kawasaki Ninja ZX-10R', 'KW-NINJA-ZX10R', 5, 7, 730000000, 'phan_khoi_lon', '998cc', 'xang', 3, 1, 5.0),
('Kawasaki Z900 ABS', 'KW-Z900', 5, 7, 320000000, 'phan_khoi_lon', '948cc', 'xang', 5, 1, 4.7),
('Piaggio Vespa Sprint 125', 'PG-VESPA-SPRINT', 2, 5, 81000000, 'xe_ga', '125cc', 'xang', 12, 1, 4.8),
('Suzuki Raider R150', 'SZ-RAIDER-150', 3, 3, 50000000, 'xe_con_tay', '150cc', 'xang', 18, 1, 4.4);

-- SEED IMAGES (Placeholder URLs)
INSERT INTO hinhanh (ma_sanpham, image_url, is_main, mo_ta_anh) VALUES
(1, '/uploads/products/wave.jpg', 1, 'Mặt trước'),
(2, '/uploads/products/vision.jpg', 1, 'Màu đỏ'),
(3, '/uploads/products/exciter.jpg', 1, 'Xanh GP'),
(4, '/uploads/products/janus.jpg', 1, 'Trắng ngọc trai'),
(5, '/uploads/products/feliz.jpg', 1, 'Đen nhám'),
(6, '/uploads/products/theon.jpg', 1, 'Xám xi măng'),
(7, '/uploads/products/ninja.jpg', 1, 'Xanh Lime'),
(8, '/uploads/products/z900.jpg', 1, 'Xám đen'),
(9, '/uploads/products/vespa.jpg', 1, 'Vàng'),
(10, '/uploads/products/raider.jpg', 1, 'Xanh đen');

-- SEED INVENTORY
INSERT INTO tonkho (ma_sanpham, soluong_tonkho) VALUES
(1, 50), (2, 30), (3, 20), (4, 15), (5, 40), (6, 10), (7, 3), (8, 5), (9, 12), (10, 18);
