const mysql = require('mysql2/promise');

async function updateColumn() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    try {
        console.log('Updating reset_token_expires to DATETIME...');
        await connection.query('ALTER TABLE users MODIFY COLUMN reset_token_expires DATETIME NULL');
        console.log('Column updated successfully!');
    } catch (error) {
        console.error('Error updating column:', error);
    } finally {
        await connection.end();
    }
}

updateColumn();
