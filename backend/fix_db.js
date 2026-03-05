const mysql = require('mysql2/promise');

async function fix() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    console.log('Connected to database.');

    try {
        // Fix Categories
        console.log('Fixing categories...');
        const categories = [
            [1, 'Xe số', 'Xe máy dạng số, phù hợp đường trường và địa hình'],
            [2, 'Xe ga', 'Xe tay ga tiện lợi, phù hợp đô thị'],
            [3, 'Xe côn tay', 'Xe phân khối trung, dành cho người đam mê tốc độ'],
            [4, 'Xe điện', 'Xe máy điện thân thiện môi trường'],
            [5, 'Phân khối lớn', 'Xe PKL trên 300cc, mô tô thể thao và touring']
        ];
        for (const [id, name, desc] of categories) {
            await connection.execute("UPDATE danhmuc SET ten_danhmuc = ?, mo_ta = ? WHERE ma_danhmuc = ?", [name, desc, id]);
        }

        // Fix Brands
        console.log('Fixing brands...');
        const brands = [
            [1, 'Honda', 'Nhật Bản', 'Thương hiệu xe máy số 1 Việt Nam'],
            [2, 'Yamaha', 'Nhật Bản', 'Xe máy Yamaha - Revs Your Heart'],
            [3, 'Suzuki', 'Nhật Bản', 'Xe máy Suzuki - Way of Life'],
            [4, 'SYM', 'Đài Loan', 'Xe máy SYM - chất lượng Đài Loan'],
            [5, 'Piaggio', 'Ý', 'Xe ga cao cấp Piaggio, Vespa'],
            [6, 'VinFast', 'Việt Nam', 'Xe điện thương hiệu Việt'],
            [7, 'Kawasaki', 'Nhật Bản', 'Mô tô thể thao Kawasaki'],
            [8, 'Kymco', 'Đài Loan', 'Xe máy Kymco'],
            [9, 'Peugeot', 'Pháp', 'Xe ga cao cấp Peugeot Motocycles']
        ];
        for (const [id, name, country, desc] of brands) {
            await connection.execute("UPDATE thuonghieu SET ten_thuonghieu = ?, nuoc_san_xuat = ?, mo_ta = ? WHERE ma_thuonghieu = ?", [name, country, desc, id]);
        }

        // Fix Broken Images
        console.log('Fixing broken images...');
        const fallbackImages = [
            '/uploads/products/1772553349422.jpg',
            '/uploads/products/1772609859484.png',
            '/uploads/products/1772609874695.png',
            '/uploads/products/1772609874764.png',
            '/uploads/products/1772609874833.png',
            '/uploads/products/1772609874876.png',
            '/uploads/products/1772609874926.png',
            '/uploads/products/1772609874968.png',
            '/uploads/products/1772610024055.png'
        ];

        const [images] = await connection.execute("SELECT ma_anh, image_url FROM hinhanh");
        let i = 0;
        for (const img of images) {
            // Check if it's one of the known missing images (e.g. wave.jpg, vision.jpg, etc.)
            if (!img.image_url.startsWith('/uploads/products/1772')) {
                const fallback = fallbackImages[i % fallbackImages.length];
                console.log(`Updating legacy image: ${img.image_url} -> ${fallback}`);
                await connection.execute("UPDATE hinhanh SET image_url = ? WHERE ma_anh = ?", [fallback, img.ma_anh]);
                i++;
            }
        }

        console.log('All fixes applied successfully.');
    } catch (error) {
        console.error('Error applying fixes:', error);
    } finally {
        await connection.end();
    }
}

fix();
