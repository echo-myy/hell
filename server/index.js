const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/music', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM music');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({ error: 'Failed to fetch music' });
  }
});

app.get('/api/music/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM music WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Music not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({ error: 'Failed to fetch music' });
  }
});

app.post('/api/music', async (req, res) => {
  try {
    const { title, artist, album, duration, cover_url, music_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO music (title, artist, album, duration, cover_url, music_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, artist, album, duration, cover_url, music_url]
    );
    res.status(201).json({ id: result.insertId, message: 'Music added successfully' });
  } catch (error) {
    console.error('Error adding music:', error);
    res.status(500).json({ error: 'Failed to add music' });
  }
});

app.delete('/api/music/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM music WHERE id = ?', [req.params.id]);
    res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Error deleting music:', error);
    res.status(500).json({ error: 'Failed to delete music' });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    const [existing] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    
    res.status(201).json({ id: result.insertId, username, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, email } = req.body;
    await db.query('UPDATE users SET username = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [username, email, req.params.id]);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/comments/:musicId', async (req, res) => {
  try {
    const [comments] = await db.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.music_id = ? ORDER BY c.created_at DESC',
      [req.params.musicId]
    );
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { music_id, user_id, content } = req.body;
    const [result] = await db.query(
      'INSERT INTO comments (music_id, user_id, content) VALUES (?, ?, ?)',
      [music_id, user_id, content]
    );
    
    const [newComment] = await db.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

app.post('/api/search/history', async (req, res) => {
  try {
    const { user_id, keyword } = req.body;
    
    await db.query(
      'INSERT INTO search_history (user_id, keyword) VALUES (?, ?)',
      [user_id, keyword]
    );
    
    res.json({ message: 'Search history added successfully' });
  } catch (error) {
    console.error('Error adding search history:', error);
    res.status(500).json({ error: 'Failed to add search history' });
  }
});

app.get('/api/search/history/:userId', async (req, res) => {
  try {
    const [history] = await db.query(
      'SELECT keyword, created_at FROM search_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.params.userId]
    );
    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

app.delete('/api/search/history/:userId', async (req, res) => {
  try {
    await db.query('DELETE FROM search_history WHERE user_id = ?', [req.params.userId]);
    res.json({ message: 'Search history cleared successfully' });
  } catch (error) {
    console.error('Error clearing search history:', error);
    res.status(500).json({ error: 'Failed to clear search history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
