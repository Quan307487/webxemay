const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function testConn() {
    try {
        console.log('Testing connection to:', process.env.DB_NAME || 'webxemay');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'webxemay'
        });
        console.log('Connection successful!');
        const [rows] = await connection.query('SELECT 1 + 1 as result');
        console.log('Query result:', rows[0].result);
        await connection.end();
    } catch (err) {
        console.error('Connection failed!', err);
    }
}

testConn();
