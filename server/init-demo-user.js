const mysql = require("mysql");
const bcrypt = require("bcrypt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "music_db",
});

connection.connect(async (err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Database connected");

  // 创建演示账号
  try {
    const demoUser = "demo";
    const demoPassword = "123456";
    const demoEmail = "demo@example.com";

    // 检查用户是否已存在
    const existing = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT id FROM users WHERE username = ?",
        [demoUser],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (existing && existing.length > 0) {
      console.log("Demo user already exists");
    } else {
      const hashedPassword = await bcrypt.hash(demoPassword, 10);

      await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
          [demoUser, hashedPassword, demoEmail],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      console.log("Demo user created successfully!");
      console.log(`Username: ${demoUser}`);
      console.log(`Password: ${demoPassword}`);
    }

    // 查询所有用户
    const users = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT id, username, email, created_at FROM users",
        [],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    console.log("\nAll users in database:");
    console.log(users);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    connection.end();
  }
});
