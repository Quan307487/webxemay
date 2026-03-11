
const mysql = require('mysql2/promise');

async function check() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    try {
        const [rows] = await connection.query("SHOW COLUMNS FROM users");
        console.log('Columns in users table:', rows.map(r => r.Field));
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await connection.end();
    }
}

check();
