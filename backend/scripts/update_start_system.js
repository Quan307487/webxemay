const mysql = require('mysql2/promise');

async function updateStartSystem() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'webxemay',
  });

  console.log('Connected to database.');

  try {
    console.log('Updating he_thong_khoi_dong enum to include nut_bam_app...');
    await connection.execute(`
      ALTER TABLE sanpham 
      MODIFY COLUMN he_thong_khoi_dong ENUM('de_chan', 'de_dien', 'ca_hai', 'nut_bam_app') 
      DEFAULT 'ca_hai'
    `);

    console.log('Database updated successfully.');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await connection.end();
  }
}

updateStartSystem();
