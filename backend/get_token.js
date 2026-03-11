const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'webxemay'
    });
    const [r] = await c.query('SELECT reset_token FROM users WHERE email = ?', ['admin@gmail.com']);
    console.log('TOKEN_START');
    console.log(r[0].reset_token);
    console.log('TOKEN_END');
    await c.end();
}
run();
