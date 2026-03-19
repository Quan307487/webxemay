const mysql = require('mysql2/promise');

async function updateDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'webxemay',
    });

    console.log('Connected to database.');

    try {
        console.log('Updating hop_so enum...');
        await connection.execute(`
      ALTER TABLE sanpham 
      MODIFY COLUMN hop_so ENUM('so_tay', 'so_tay_6', 'tu_dong', 'vo_cap', 'ban_tu_dong', 'khong_hop_so') 
      DEFAULT 'tu_dong'
    `);

        console.log('Updating he_thong_phanhang enum...');
        await connection.execute(`
      ALTER TABLE sanpham 
      MODIFY COLUMN he_thong_phanhang ENUM('trong', 'dia', 'trong_truoc_dia_sau', 'dia_don_thuy_luc', 'abs') 
      DEFAULT 'trong'
    `);

        console.log('Database updated successfully.');
    } catch (error) {
        console.error('Error updating database:', error);
    } finally {
        await connection.end();
    }
}

updateDatabase();
