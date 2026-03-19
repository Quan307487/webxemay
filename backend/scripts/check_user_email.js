const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkEmail() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'webxemay'
        });
        const [rows] = await connection.query('SELECT ma_user, email, reset_token FROM users WHERE email = ?', ['buiminhquan12082003@gmail.com']);
        console.log(JSON.stringify(rows));
        await connection.end();
    } catch (err) {
        console.error('Error checking email:', err);
    }
}

checkEmail();
