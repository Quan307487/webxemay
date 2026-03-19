const mysql = require('mysql2/promise');

async function createTable() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    try {
        await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_name VARCHAR(255) DEFAULT 'MotoShop',
        phone VARCHAR(20) DEFAULT '0339886769',
        email VARCHAR(255) DEFAULT 'buiminhquan12082003@gmail.com',
        address TEXT,
        facebook_url VARCHAR(255) DEFAULT 'https://www.facebook.com/share/1C6edfa7SN/',
        youtube_url VARCHAR(255) DEFAULT 'https://youtube.com/@quanbui2507?si=4WSTdar01MDoCAyE',
        instagram_url VARCHAR(255) DEFAULT 'https://www.instagram.com/direct/inbox/',
        zalo_url VARCHAR(255) DEFAULT 'https://zalo.me/0339886769',
        footer_text TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

        const [rows] = await connection.query('SELECT COUNT(*) as count FROM settings');
        if (rows[0].count === 0) {
            await connection.query(`
        INSERT INTO settings (site_name, address, footer_text) 
        VALUES ('MotoShop', 'Thôn An Hòa, Xã Tam An, TP.Đà Nẵng', '© 2026 MotoShop Vietnam. All rights reserved.')
      `);
        }

        console.log('✅ Settings table created and seeded!');
    } catch (err) {
        console.error('❌ Error creating table:', err);
    } finally {
        await connection.end();
    }
}

createTable();
