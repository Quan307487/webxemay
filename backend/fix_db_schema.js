
const mysql = require('mysql2/promise');

async function fix() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    try {
        console.log('Adding hinh_anh column to users table...');
        await connection.query("ALTER TABLE users ADD COLUMN hinh_anh VARCHAR(255) NULL AFTER quyen");
        console.log('Success!');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column hinh_anh already exists.');
        } else {
            console.error('Error:', err.message);
        }
    } finally {
        await connection.end();
    }
}

fix();
