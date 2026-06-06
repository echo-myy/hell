const mysql = require('mysql2/promise');

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456'
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS music_db');
  await connection.query('USE music_db');

  await connection.query(`
    CREATE TABLE IF NOT EXISTS music (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      artist VARCHAR(255),
      album VARCHAR(255),
      duration INT,
      cover_url VARCHAR(500),
      music_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database and table created successfully');
  await connection.end();
}

initDatabase().catch(console.error);
