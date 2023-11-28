import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 4000;

const db = new sqlite3.Database('mydatabase.db');

// Create a table (if not exists)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");

  // Insert sample data
  const sampleData = [];

  const insertStatement = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');

  for (const data of sampleData) {
    insertStatement.run(data.name, data.email);
  }

  insertStatement.finalize();
});

app.use(express.json());

app.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Please provide name and email' });
    return;
  }
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User added', userId: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
