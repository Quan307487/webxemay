const mysql = require('mysql2/promise');

async function repair() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    console.log('Connected to database.');

    try {
        console.log('Repairing corrupted strings in sanpham table...');

        // Define common corrupted mappings or simply re-apply clean strings
        const products = [
            { id: 1, origin: 'Việt Nam' },
            { id: 2, origin: 'Việt Nam' },
            { id: 3, origin: 'Nhật Bản' },
            { id: 4, origin: 'Việt Nam' },
            { id: 5, origin: 'Thái Lan' },
            { id: 6, origin: 'Việt Nam' },
            { id: 7, origin: 'Nhật Bản' },
            { id: 8, origin: 'Việt Nam' },
            { id: 9, origin: 'Nhật Bản' },
            { id: 10, origin: 'Việt Nam' },
            { id: 11, origin: 'Ý' },
            { id: 12, origin: 'Việt Nam' }
        ];

        for (const p of products) {
            await connection.execute("UPDATE sanpham SET xuat_xu = ? WHERE ma_sanpham = ?", [p.origin, p.id]);
        }

        // Repair Colors
        const colors = [
            { id: 1, color: 'Trắng Đen, Đen Tuyển, Đỏ Đen' },
            { id: 2, color: 'Trắng, Đen, Đỏ, Xanh' },
            { id: 4, color: 'Trắng, Đen, Đỏ, Xanh Lục' },
            { id: 6, color: 'Trắng, Đen, Xanh Dương' },
            { id: 8, color: 'Trắng, Đen, Đỏ, Xanh' },
            { id: 10, color: 'Trắng, Đen, Đỏ, Xanh' },
            { id: 11, color: 'Trắng, Đen, Đỏ, Vàng' },
            { id: 12, color: 'Trắng, Đen, Xanh, Cam' }
        ];
        for (const c of colors) {
            await connection.execute("UPDATE sanpham SET mau_sac = ? WHERE ma_sanpham = ?", [c.color, c.id]);
        }

        // Repair Descriptions (Simplifying to clean text)
        const commonDesc = "Dòng xe máy hiện đại với thiết kế sang trọng, động cơ mạnh mẽ và tiết kiệm nhiên liệu. Phù hợp cho nhu cầu di chuyển hàng ngày và khẳng định phong cách cá nhân.";
        await connection.execute("UPDATE sanpham SET mo_ta = ? WHERE mo_ta LIKE '%?%' OR mo_ta IS NULL", [commonDesc]);

        // Fix other common fields
        await connection.execute("UPDATE sanpham SET loai_nhien_lieu = 'xang' WHERE loai_nhien_lieu LIKE '%xang%' OR loai_nhien_lieu LIKE '%x?ng%'");
        await connection.execute("UPDATE sanpham SET loai_nhien_lieu = 'dien' WHERE loai_nhien_lieu LIKE '%dien%' OR loai_nhien_lieu LIKE '%?i?n%'");
        await connection.execute("UPDATE sanpham SET hop_so = 'tu_dong' WHERE ma_sanpham IN (2, 4, 8, 10, 11)");
        await connection.execute("UPDATE sanpham SET hop_so = 'tu_dong' WHERE ma_sanpham IN (2, 4, 8, 10, 11)"); // Double check
        await connection.execute("UPDATE sanpham SET he_thong_phanh = 'dia' WHERE ma_sanpham IN (1, 3, 5, 7, 9, 12)");

        console.log('Database repair completed.');
    } catch (error) {
        console.error('Error during repair:', error);
    } finally {
        await connection.end();
    }
}

repair();
