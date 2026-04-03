const mysql = require('mysql2/promise');
require('dotenv').config();

async function addCategory() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webxemay',
  });

  const ten = 'Xe tay ga cao cấp';
  const mo_ta = 'Các dòng xe tay ga phân khúc cao cấp';
  
  const [result] = await connection.execute(
    'INSERT INTO danhmuc (ten_danhmuc, mo_ta, is_active) VALUES (?, ?, 1)',
    [ten, mo_ta]
  );
  
  console.log('Inserted category ID:', result.insertId);
  await connection.end();
}

addCategory().catch(console.error);
