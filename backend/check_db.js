const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webxemay',
  });

  const [rows] = await connection.execute('SHOW CREATE TABLE sanpham');
  const createTable = rows[0]['Create Table'];
  const lines = createTable.split('\n');
  const phanhLine = lines.find(l => l.includes('he_thong_phanhang'));
  console.log(phanhLine.trim());
  await connection.end();
}

check().catch(console.error);
