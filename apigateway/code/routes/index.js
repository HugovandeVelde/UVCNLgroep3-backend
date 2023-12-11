import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 4002;

const db = new sqlite3.Database('users.db');

// Middleware to allow all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Create users table (if not exists)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");

  // Insert sample user data
  const sampleUserData = [
    {  },
  ];

  const insertUserStatement = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');

  for (const data of sampleUserData) {
    insertUserStatement.run(data.name, data.email);
  }

  insertUserStatement.finalize();
});

// Create recipes table (if not exists)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, creator_id INTEGER, name TEXT)");

  // Insert sample recipe data
  const sampleRecipeData = [
    { },
  ];

  const insertRecipeStatement = db.prepare('INSERT INTO recipes (creator_id, name) VALUES (?, ?)');

  for (const data of sampleRecipeData) {
    insertRecipeStatement.run(data.creator_id, data.name);
  }

  insertRecipeStatement.finalize();
});

app.use(express.json());

// Get all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new user
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

// Get all recipes
app.get('/recipes', (req, res) => {
  db.all('SELECT * FROM recipes', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new recipe
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  
  // Ensure all necessary fields are provided
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please provide name, email, and password' });
    return;
  }

  // Insert the new user into the database
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User registered', userId: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
