const mysql = require('mysql2/promise');

async function check() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    try {
        const [orders] = await connection.execute('SELECT ma_donhang, donhang_code, trang_thai, trang_thai_TT FROM donhang ORDER BY ngay_dat DESC LIMIT 10');
        console.log('--- LATEST ORDERS ---');
        console.table(orders);

        const [payments] = await connection.execute('SELECT ma_thanhtoan, ma_donhang, trang_thai FROM thanhtoan ORDER BY ngay_thanhtoan DESC LIMIT 10');
        console.log('--- LATEST PAYMENTS ---');
        console.table(payments);

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

check();
