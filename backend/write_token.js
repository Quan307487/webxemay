const mysql = require('mysql2/promise');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
    const c = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'webxemay'
    });
    const [r] = await c.query('SELECT reset_token FROM users WHERE email = ?', ['buiminhquan12082003@gmail.com']);
    fs.writeFileSync('latest_token.txt', r[0].reset_token);
    await c.end();
    console.log('Token written to latest_token.txt');
}
run();
