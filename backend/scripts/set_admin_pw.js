const { createConnection } = require('mysql2/promise');
const bcrypt = require('bcrypt');
async function main() {
    const c = await createConnection({ host: 'localhost', user: 'root', password: '', database: 'webxemay' });
    const hash = await bcrypt.hash('admin@123', 10);
    await c.execute("UPDATE users SET password_hash = ? WHERE email = 'admin@gmail.com'", [hash]);
    console.log('Password updated to admin@123');
    await c.end();
}
main().catch(console.error);
