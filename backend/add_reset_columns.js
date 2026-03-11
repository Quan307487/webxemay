const mysql = require('mysql2/promise');

async function addColumns() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'webxemay'
    });

    try {
        console.log('Checking for reset_token column...');
        const [columns] = await connection.query('SHOW COLUMNS FROM users LIKE "reset_token"');

        if (columns.length === 0) {
            console.log('Adding reset_token and reset_token_expires columns...');
            await connection.query('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) NULL');
            await connection.query('ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP NULL');
            console.log('Columns added successfully!');
        } else {
            console.log('Columns already exist.');
        }
    } catch (error) {
        console.error('Error adding columns:', error);
    } finally {
        await connection.end();
    }
}

addColumns();
