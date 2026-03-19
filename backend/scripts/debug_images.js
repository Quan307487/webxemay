
const mysql = require('mysql2/promise');
async function check() {
    const conn = await mysql.createConnection('mysql://root:root@localhost:3306/motoshop');
    const [rows] = await conn.execute('SELECT * FROM hinhanh LIMIT 20');
    console.log(JSON.stringify(rows, null, 2));
    await conn.end();
}
check().catch(console.error);
