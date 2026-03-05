const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

async function test() {
    const secret = 'webxemay_super_secret_key_2026';
    const payload = { sub: 5, email: 'test2@example.com', quyen: 'customer' }; // test2 user
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    console.log('TOKEN:', token);

    // Now try to call the API (I'll just check if the payload is valid for the strategy)
    // Actually, I'll just check the DB record for user 5 again.
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'webxemay' });
    const [users] = await conn.execute('SELECT * FROM users WHERE ma_user = 5');
    console.log('USER 5:', users[0]);

    const [orders] = await conn.execute('SELECT * FROM donhang WHERE ma_user = 5');
    console.log('ORDERS FOR USER 5:', orders);

    await conn.end();
}
test();
