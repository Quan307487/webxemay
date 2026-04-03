const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webxemay',
  });

  const [rows] = await connection.execute('SELECT ma_danhmuc, ten_danhmuc FROM danhmuc');
  rows.forEach(row => {
    console.log(`ID: ${row.ma_danhmuc}, Name: ${row.ten_danhmuc}`);
  });
  await connection.end();
}

check().catch(console.error);
