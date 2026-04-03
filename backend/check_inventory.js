const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webxemay',
  });

  // Check current tonkho data
  const [rows] = await conn.execute(`
    SELECT sp.ma_sanpham, sp.ten_sanpham, tk.ma_tonkho, tk.soluong_tonkho
    FROM sanpham sp
    LEFT JOIN tonkho tk ON sp.ma_sanpham = tk.ma_sanpham
    ORDER BY sp.ma_sanpham DESC
    LIMIT 5
  `);
  console.log('Sample data (LEFT JOIN):', JSON.stringify(rows, null, 2));

  const [total] = await conn.execute('SELECT COUNT(*) as cnt FROM tonkho');
  console.log('Total tonkho records:', total[0].cnt);

  await conn.end();
}

check().catch(console.error);
