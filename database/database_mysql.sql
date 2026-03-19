-- ============================================================
--  Website Bán Xe Máy - Database MySQL
--  Tương thích: MySQL 8.0+
--  Cập nhật: 2026-03-02 — Chuyển từ xe đạp sang xe máy
-- ============================================================

CREATE DATABASE IF NOT EXISTS webxemay
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE webxemay;

-- ============================================================
-- 1. USERS (Người dùng)
-- ============================================================
CREATE TABLE users (
    ma_user       INT AUTO_INCREMENT PRIMARY KEY,
    ten_user      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    hovaten       VARCHAR(100),
    SDT           VARCHAR(20),
    diachi        VARCHAR(255),
    quyen         ENUM('customer', 'admin')            DEFAULT 'customer',
    status        ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    ngay_lap      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cap_nhat_ngay TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. CATEGORIES (Danh mục xe máy)
-- Ví dụ: Xe số, Xe ga, Xe côn tay, Xe điện, Xe phân khối lớn
-- ============================================================
CREATE TABLE danhmuc (
    ma_danhmuc  INT AUTO_INCREMENT PRIMARY KEY,
    ten_danhmuc VARCHAR(100) NOT NULL UNIQUE,
    mo_ta       TEXT,
    is_active   TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. BRANDS (Thương hiệu xe máy)
-- Ví dụ: Honda, Yamaha, Suzuki, Kawasaki, SYM, Piaggio, VinFast
-- ============================================================
CREATE TABLE thuonghieu (
    ma_thuonghieu  INT AUTO_INCREMENT PRIMARY KEY,
    ten_thuonghieu VARCHAR(100) NOT NULL UNIQUE,
    nuoc_san_xuat  VARCHAR(100),          -- Nhật, Ý, Việt Nam...
    logo_url       VARCHAR(255),
    mo_ta          TEXT,
    is_active      TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. PRODUCTS (Xe máy) — bổ sung đầy đủ thông số kỹ thuật
-- ============================================================
CREATE TABLE sanpham (
    ma_sanpham          INT AUTO_INCREMENT PRIMARY KEY,
    ten_sanpham         VARCHAR(150) NOT NULL,
    sanpham_code        VARCHAR(50)  UNIQUE,           -- Mã model, VD: HONDA-WAVE-ALPHA-110
    ma_danhmuc          INT NOT NULL,
    ma_thuonghieu       INT NOT NULL,
    mo_ta               TEXT,

    -- Giá & khuyến mãi
    gia                 DECIMAL(12, 0) NOT NULL,        -- Giá xe máy thường lớn (VNĐ)
    kieu_giam_gia       ENUM('percentage', 'fixed_amount') DEFAULT 'percentage',
    gia_tri_giam        DECIMAL(12, 0) DEFAULT 0,
    ton_kho             INT DEFAULT 0,

    -- Thông số kỹ thuật xe máy
    nam_san_xuat        YEAR,                           -- Năm sản xuất
    mau_sac             VARCHAR(100),                   -- Màu sắc (có thể nhiều màu, lưu chuỗi)
    kieu_xe             ENUM('xe_so', 'xe_ga', 'xe_con_tay', 'xe_dien', 'phan_khoi_lon') NOT NULL,
    dung_tich_dong_co   VARCHAR(20),                    -- VD: 110cc, 150cc, 250cc
    loai_dong_co        VARCHAR(100),                   -- VD: 4 kỳ, SOHC, 2 xi-lanh
    loai_nhien_lieu     ENUM('xang', 'dien', 'hybrid')  DEFAULT 'xang',
    muc_tieu_thu        VARCHAR(50),                    -- VD: 1.8L/100km
    cong_suat_toi_da    VARCHAR(50),                    -- VD: 8.5kW / 8000rpm
    momen_xoan_toi_da   VARCHAR(50),                    -- VD: 9.3Nm / 6000rpm
    hop_so              ENUM('so_tay', 'tu_dong', 'ban_tu_dong', 'khong_hop_so') DEFAULT 'tu_dong',
    he_thong_phanhang   ENUM('trong', 'dia', 'trong_truoc_dia_sau', 'abs') DEFAULT 'trong', -- Phanh
    he_thong_khoi_dong  ENUM('de_chan', 'de_dien', 'ca_hai') DEFAULT 'ca_hai',
    trong_luong_kho     DECIMAL(6, 1),                  -- kg
    kich_thuoc          VARCHAR(100),                   -- DxRxC (mm), VD: 1919x718x1073
    chieu_cao_yen       DECIMAL(5, 1),                  -- mm
    dung_tich_binh_xang DECIMAL(4, 1),                  -- Lít (NULL nếu xe điện)
    cong_suat_pin       VARCHAR(50),                    -- kWh (chỉ xe điện)
    pham_vi_hanh_trinh  VARCHAR(50),                    -- km (chỉ xe điện)
    kich_co_lop_truoc   VARCHAR(30),                    -- VD: 80/90-14
    kich_co_lop_sau     VARCHAR(30),                    -- VD: 90/90-14
    xuat_xu             VARCHAR(100),                   -- Nơi sản xuất/lắp ráp

    -- Đánh giá & trạng thái
    diem_danh_gia       DECIMAL(3, 2) DEFAULT 0,
    is_active           TINYINT(1) DEFAULT 1,
    ngay_lap            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sp_danhmuc    FOREIGN KEY (ma_danhmuc)    REFERENCES danhmuc(ma_danhmuc),
    CONSTRAINT fk_sp_thuonghieu FOREIGN KEY (ma_thuonghieu) REFERENCES thuonghieu(ma_thuonghieu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. PRODUCT_IMAGES (Hình ảnh xe máy)
-- ============================================================
CREATE TABLE hinhanh (
    ma_anh      INT AUTO_INCREMENT PRIMARY KEY,
    ma_sanpham  INT NOT NULL,
    image_url   VARCHAR(255) NOT NULL,
    mo_ta_anh   VARCHAR(150),           -- VD: "Màu đỏ", "Góc nghiêng trái"
    is_main     TINYINT(1) DEFAULT 0,
    thu_tu      INT DEFAULT 0,          -- Thứ tự hiển thị
    CONSTRAINT fk_ha_sanpham FOREIGN KEY (ma_sanpham) REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. CARTS (Giỏ hàng)
-- ============================================================
CREATE TABLE giohang (
    ma_gio   INT AUTO_INCREMENT PRIMARY KEY,
    ma_user  INT NOT NULL UNIQUE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gh_user FOREIGN KEY (ma_user) REFERENCES users(ma_user) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. CART_ITEMS (Chi tiết giỏ hàng)
-- Lưu ý: xe máy thường mua 1 chiếc, nhưng vẫn giữ so_luong để linh hoạt
-- ============================================================
CREATE TABLE chitietgiohang (
    ma_CTGH      INT AUTO_INCREMENT PRIMARY KEY,
    ma_gio       INT NOT NULL,
    ma_sanpham   INT NOT NULL,
    mau_chon     VARCHAR(100),           -- Màu xe cụ thể khách chọn
    so_luong     INT NOT NULL DEFAULT 1,
    gia_hien_tai DECIMAL(12, 0) NOT NULL,
    CONSTRAINT fk_ctgh_gio     FOREIGN KEY (ma_gio)     REFERENCES giohang(ma_gio)    ON DELETE CASCADE,
    CONSTRAINT fk_ctgh_sanpham FOREIGN KEY (ma_sanpham) REFERENCES sanpham(ma_sanpham)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. ORDERS (Đơn hàng)
-- ============================================================
CREATE TABLE donhang (
    ma_donhang     INT AUTO_INCREMENT PRIMARY KEY,
    donhang_code   VARCHAR(50) NOT NULL UNIQUE,         -- VD: XM-20260302-0001
    ma_user        INT NOT NULL,
    ngay_dat       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai     ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    tong_tien      DECIMAL(12, 0) NOT NULL,
    phi_van_chuyen DECIMAL(10, 0) DEFAULT 0,
    phuong_thuc_TT ENUM('credit_card', 'bank_transfer', 'cod', 'momo', 'vnpay') NOT NULL,
    trang_thai_TT  ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    dia_chi_giao   VARCHAR(255) NOT NULL,
    ten_nguoi_nhan VARCHAR(100),
    sdt_nguoi_nhan VARCHAR(20),
    ghi_chu        TEXT,                                -- Ghi chú của khách
    day_du_kien    DATE,
    day_thuc_te    DATE,
    CONSTRAINT fk_dh_user FOREIGN KEY (ma_user) REFERENCES users(ma_user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. ORDER_ITEMS (Chi tiết đơn hàng)
-- ============================================================
CREATE TABLE chitietdonhang (
    ma_CTDH     INT AUTO_INCREMENT PRIMARY KEY,
    ma_donhang  INT NOT NULL,
    ma_sanpham  INT NOT NULL,
    ten_sanpham VARCHAR(150),
    mau_xe      VARCHAR(100),           -- Màu xe tại thời điểm đặt
    so_luong    INT NOT NULL,
    don_gia     DECIMAL(12, 0) NOT NULL,
    thanh_tien  DECIMAL(12, 0) NOT NULL,
    CONSTRAINT fk_ctdh_donhang FOREIGN KEY (ma_donhang) REFERENCES donhang(ma_donhang) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. REVIEWS (Đánh giá)
-- ============================================================
CREATE TABLE danhgia (
    ma_danhgia   INT AUTO_INCREMENT PRIMARY KEY,
    ma_sanpham   INT NOT NULL,
    ma_user      INT NOT NULL,
    ma_donhang   INT,                   -- Chỉ cho phép review nếu đã mua
    diem_danhgia INT NOT NULL CHECK (diem_danhgia >= 1 AND diem_danhgia <= 5),
    tieu_de      VARCHAR(150),
    viet_danhgia TEXT,
    trang_thai   ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    ngay_lap     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dg_sanpham FOREIGN KEY (ma_sanpham) REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE,
    CONSTRAINT fk_dg_user    FOREIGN KEY (ma_user)    REFERENCES users(ma_user)       ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. WISHLISTS (Danh sách yêu thích)
-- ============================================================
CREATE TABLE dsyeuthich (
    ma_dsyeuthich INT AUTO_INCREMENT PRIMARY KEY,
    ma_user       INT NOT NULL,
    ma_sanpham    INT NOT NULL,
    ngay_lap      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_sanpham (ma_user, ma_sanpham),
    CONSTRAINT fk_yt_user    FOREIGN KEY (ma_user)    REFERENCES users(ma_user)      ON DELETE CASCADE,
    CONSTRAINT fk_yt_sanpham FOREIGN KEY (ma_sanpham) REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. COUPONS (Mã khuyến mãi)
-- ============================================================
CREATE TABLE ma_khuyenmai (
    ma_khuyenmai  INT AUTO_INCREMENT PRIMARY KEY,
    ma_giamgia    VARCHAR(50) NOT NULL UNIQUE,
    kieu_giamgia  ENUM('percentage', 'fixed_amount') NOT NULL,
    giatrigiam    DECIMAL(12, 0) NOT NULL,
    don_toithieu  DECIMAL(12, 0) DEFAULT 0,
    solandung     INT,
    solan_hientai INT DEFAULT 0,
    ngay_batdau   DATETIME NOT NULL,
    ngay_ketthuc  DATETIME NOT NULL,
    is_active     TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. PAYMENTS (Thanh toán)
-- Thêm momo, vnpay phù hợp thanh toán xe máy VN
-- ============================================================
CREATE TABLE thanhtoan (
    ma_thanhtoan     INT AUTO_INCREMENT PRIMARY KEY,
    ma_donhang       INT NOT NULL,
    ngay_thanhtoan   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thanh_tien       DECIMAL(12, 0) NOT NULL,
    PT_thanhtoan     ENUM('credit_card', 'bank_transfer', 'cod', 'momo', 'vnpay') NOT NULL,
    ma_giao_dich     VARCHAR(100),       -- Transaction ID từ cổng thanh toán
    ma_giamgia       VARCHAR(50),
    so_tien_giamgia  DECIMAL(12, 0) DEFAULT 0,
    trang_thai       ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    ghi_chu          VARCHAR(255),
    CONSTRAINT fk_tt_donhang   FOREIGN KEY (ma_donhang) REFERENCES donhang(ma_donhang) ON DELETE CASCADE,
    CONSTRAINT fk_tt_khuyenmai FOREIGN KEY (ma_giamgia) REFERENCES ma_khuyenmai(ma_giamgia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. INVENTORY (Tồn kho)
-- ============================================================
CREATE TABLE tonkho (
    ma_tonkho      INT AUTO_INCREMENT PRIMARY KEY,
    ma_sanpham     INT NOT NULL UNIQUE,
    soluong_tonkho INT DEFAULT 0,
    ngay_cap_nhat  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tk_sanpham FOREIGN KEY (ma_sanpham) REFERENCES sanpham(ma_sanpham) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Tự động tính điểm đánh giá trung bình khi INSERT review
CREATE TRIGGER trg_update_rating_after_insert
AFTER INSERT ON danhgia
FOR EACH ROW
BEGIN
    UPDATE sanpham
    SET diem_danh_gia = (
        SELECT COALESCE(AVG(diem_danhgia), 0)
        FROM danhgia
        WHERE ma_sanpham = NEW.ma_sanpham AND trang_thai = 'approved'
    )
    WHERE ma_sanpham = NEW.ma_sanpham;
END$$

-- Tự động tính điểm đánh giá trung bình khi UPDATE review
CREATE TRIGGER trg_update_rating_after_update
AFTER UPDATE ON danhgia
FOR EACH ROW
BEGIN
    UPDATE sanpham
    SET diem_danh_gia = (
        SELECT COALESCE(AVG(diem_danhgia), 0)
        FROM danhgia
        WHERE ma_sanpham = NEW.ma_sanpham AND trang_thai = 'approved'
    )
    WHERE ma_sanpham = NEW.ma_sanpham;
END$$

-- Tự động tính điểm đánh giá trung bình khi DELETE review
CREATE TRIGGER trg_update_rating_after_delete
AFTER DELETE ON danhgia
FOR EACH ROW
BEGIN
    UPDATE sanpham
    SET diem_danh_gia = (
        SELECT COALESCE(AVG(diem_danhgia), 0)
        FROM danhgia
        WHERE ma_sanpham = OLD.ma_sanpham AND trang_thai = 'approved'
    )
    WHERE ma_sanpham = OLD.ma_sanpham;
END$$

DELIMITER ;


-- ============================================================
-- INDEXES
-- ============================================================

-- Sản phẩm
CREATE INDEX idx_sanpham_active    ON sanpham(is_active);
CREATE INDEX idx_sanpham_danhmuc   ON sanpham(ma_danhmuc);
CREATE INDEX idx_sanpham_gia       ON sanpham(gia);
CREATE INDEX idx_sanpham_danhgia   ON sanpham(diem_danh_gia DESC);
CREATE INDEX idx_sanpham_kieuxe    ON sanpham(kieu_xe);
CREATE INDEX idx_sanpham_nhienlie  ON sanpham(loai_nhien_lieu);
CREATE INDEX idx_sanpham_nam       ON sanpham(nam_san_xuat);

-- Users
CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- Đơn hàng
CREATE INDEX idx_donhang_user      ON donhang(ma_user);
CREATE INDEX idx_donhang_trangthai ON donhang(trang_thai);
CREATE INDEX idx_donhang_ngay      ON donhang(ngay_dat DESC);

-- Đánh giá
CREATE INDEX idx_danhgia_sanpham   ON danhgia(ma_sanpham);
CREATE INDEX idx_danhgia_trangthai ON danhgia(trang_thai);


-- ============================================================
-- DỮ LIỆU MẪU (Sample Data)
-- ============================================================

-- Danh mục xe máy
INSERT INTO danhmuc (ten_danhmuc, mo_ta) VALUES
('Xe số',        'Xe máy dạng số, phù hợp đường trường và địa hình'),
('Xe ga',        'Xe tay ga tiện lợi, phù hợp đô thị'),
('Xe côn tay',   'Xe phân khối trung, dành cho người đam mê tốc độ'),
('Xe điện',      'Xe máy điện thân thiện môi trường'),
('Phân khối lớn','Xe PKL trên 300cc, mô tô thể thao và touring');

-- Thương hiệu xe máy
INSERT INTO thuonghieu (ten_thuonghieu, nuoc_san_xuat, mo_ta) VALUES
('Honda',    'Nhật Bản',    'Thương hiệu xe máy số 1 Việt Nam'),
('Yamaha',   'Nhật Bản',    'Xe máy Yamaha - Revs Your Heart'),
('Suzuki',   'Nhật Bản',    'Xe máy Suzuki - Way of Life'),
('SYM',      'Đài Loan',    'Xe máy SYM - chất lượng Đài Loan'),
('Piaggio',  'Ý',           'Xe ga cao cấp Piaggio, Vespa'),
('VinFast',  'Việt Nam',    'Xe điện thương hiệu Việt'),
('Kawasaki', 'Nhật Bản',    'Mô tô thể thao Kawasaki'),
('Kymco',    'Đài Loan',    'Xe máy Kymco'),
('Peugeot',  'Pháp',        'Xe ga cao cấp Peugeot Motocycles');


-- ============================================================
-- QUERIES MẪU (Xe máy)
-- ============================================================

-- Lấy 10 xe máy bán chạy nhất
-- SELECT sp.ma_sanpham, sp.ten_sanpham, sp.kieu_xe, sp.gia, th.ten_thuonghieu,
--        COUNT(ctdh.ma_sanpham) AS da_ban
-- FROM sanpham sp
-- JOIN thuonghieu th ON sp.ma_thuonghieu = th.ma_thuonghieu
-- LEFT JOIN chitietdonhang ctdh ON sp.ma_sanpham = ctdh.ma_sanpham
-- WHERE sp.is_active = 1
-- GROUP BY sp.ma_sanpham
-- ORDER BY da_ban DESC
-- LIMIT 10;

-- Lọc xe máy theo loại nhiên liệu điện
-- SELECT sp.*, th.ten_thuonghieu, dm.ten_danhmuc
-- FROM sanpham sp
-- JOIN thuonghieu th ON sp.ma_thuonghieu = th.ma_thuonghieu
-- JOIN danhmuc dm ON sp.ma_danhmuc = dm.ma_danhmuc
-- WHERE sp.loai_nhien_lieu = 'dien' AND sp.is_active = 1
-- ORDER BY sp.gia ASC;

-- Lọc xe máy theo kiểu xe + khoảng giá
-- SELECT * FROM sanpham
-- WHERE kieu_xe = 'xe_ga'
--   AND gia BETWEEN 30000000 AND 80000000
--   AND is_active = 1
-- ORDER BY gia ASC;

-- Tính doanh thu 30 ngày gần nhất
-- SELECT SUM(tong_tien) AS doanh_thu, COUNT(*) AS so_don, AVG(tong_tien) AS tb_don
-- FROM donhang
-- WHERE trang_thai != 'cancelled'
--   AND ngay_dat >= NOW() - INTERVAL 30 DAY;
