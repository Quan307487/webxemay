const mysql = require('mysql2/promise');
require('dotenv').config();

async function verify() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webxemay',
  });

  const [rows] = await connection.execute('SHOW CREATE TABLE sanpham');
  const createTable = rows[0]['Create Table'];
  if (createTable.includes('abs_truoc_dia_sau')) {
    console.log('Verification Success: New enum value exists in database.');
  } else {
    console.error('Verification Failed: New enum value missing.');
  }
  await connection.end();
}

verify().catch(console.error);
