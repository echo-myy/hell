const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'music_db'
});

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功');
  
  createTables();
});

function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      avatar VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createCommentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      music_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_music_id (music_id),
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createSearchHistoryTable = `
    CREATE TABLE IF NOT EXISTS search_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      keyword VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_keyword (keyword)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  connection.query(createUsersTable, (err) => {
    if (err) {
      console.error('创建users表失败:', err);
      return;
    }
    console.log('users表创建成功');
    
    connection.query(createCommentsTable, (err) => {
      if (err) {
        console.error('创建comments表失败:', err);
        return;
      }
      console.log('comments表创建成功');
      
      connection.query(createSearchHistoryTable, (err) => {
        if (err) {
          console.error('创建search_history表失败:', err);
          return;
        }
        console.log('search_history表创建成功');
        console.log('所有表创建完成');
        connection.end();
      });
    });
  });
}
