const mysql = require('mysql2/promise');

async function updateKieuXeEnum() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'webxemay',
  });

  console.log('Connected to database.');

  try {
    console.log('Updating kieu_xe enum to include naked_bike...');
    await connection.execute(`
      ALTER TABLE sanpham 
      MODIFY COLUMN kieu_xe ENUM('xe_so', 'xe_ga', 'xe_con_tay', 'xe_dien', 'phan_khoi_lon', 'naked_bike') NOT NULL
    `);

    console.log('Database updated successfully.');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await connection.end();
  }
}

updateKieuXeEnum();
