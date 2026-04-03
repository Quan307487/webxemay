const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webxemay',
  });

  const sql = `ALTER TABLE sanpham MODIFY COLUMN he_thong_phanhang 
               ENUM('trong', 'dia', 'trong_truoc_dia_sau', 'dia_don_thuy_luc', 'brembo_kibs', 'abs', 'abs_truoc_dia_sau', 'trong_truoc_trong_sau', 'abs_3_kenh_asr') 
               DEFAULT 'trong'`;
  
  await connection.execute(sql);
  console.log('Database schema updated successfully (ASR).');
  await connection.end();
}

updateSchema().catch(console.error);
