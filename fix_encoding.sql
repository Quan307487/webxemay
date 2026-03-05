USE webxemay;
SET NAMES utf8mb4;

-- Fix Categories
UPDATE danhmuc SET ten_danhmuc = 'Xe số' WHERE ma_danhmuc = 1;
UPDATE danhmuc SET ten_danhmuc = 'Xe ga' WHERE ma_danhmuc = 2;
UPDATE danhmuc SET ten_danhmuc = 'Xe côn tay' WHERE ma_danhmuc = 3;
UPDATE danhmuc SET ten_danhmuc = 'Xe điện' WHERE ma_danhmuc = 4;
UPDATE danhmuc SET ten_danhmuc = 'Phân khối lớn' WHERE ma_danhmuc = 5;

-- Fix Brands
UPDATE thuonghieu SET ten_thuonghieu = 'Honda', nuoc_san_xuat = 'Nhật Bản' WHERE ma_thuonghieu = 1;
UPDATE thuonghieu SET ten_thuonghieu = 'Yamaha', nuoc_san_xuat = 'Nhật Bản' WHERE ma_thuonghieu = 2;
UPDATE thuonghieu SET ten_thuonghieu = 'Suzuki', nuoc_san_xuat = 'Nhật Bản' WHERE ma_thuonghieu = 3;
UPDATE thuonghieu SET ten_thuonghieu = 'SYM', nuoc_san_xuat = 'Đài Loan' WHERE ma_thuonghieu = 4;
UPDATE thuonghieu SET ten_thuonghieu = 'Piaggio', nuoc_san_xuat = 'Ý' WHERE ma_thuonghieu = 5;
UPDATE thuonghieu SET ten_thuonghieu = 'VinFast', nuoc_san_xuat = 'Việt Nam' WHERE ma_thuonghieu = 6;
UPDATE thuonghieu SET ten_thuonghieu = 'Kawasaki', nuoc_san_xuat = 'Nhật Bản' WHERE ma_thuonghieu = 7;
UPDATE thuonghieu SET ten_thuonghieu = 'Kymco', nuoc_san_xuat = 'Đài Loan' WHERE ma_thuonghieu = 8;
UPDATE thuonghieu SET ten_thuonghieu = 'Peugeot', nuoc_san_xuat = 'Pháp' WHERE ma_thuonghieu = 9;
