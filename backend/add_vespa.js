const mysql = require('mysql2/promise');

async function addVespa() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'webxemay',
      connectTimeout: 10000
    });
    console.log('Successfully connected to database.');

    const [rows] = await connection.execute('SELECT * FROM thuonghieu WHERE ten_thuonghieu = ?', ['Vespa']);
    if (rows.length > 0) {
      console.log('Vespa already exists.');
    } else {
      const [result] = await connection.execute(
        'INSERT INTO thuonghieu (ten_thuonghieu, nuoc_san_xuat, mo_ta, is_active) VALUES (?, ?, ?, ?)',
        ['Vespa', 'Ý', 'Thương hiệu xe ga cao cấp từ Ý', 1]
      );
      console.log('Successfully added Vespa. ID:', result.insertId);
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

addVespa();
