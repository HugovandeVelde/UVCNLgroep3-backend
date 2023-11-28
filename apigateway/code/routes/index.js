import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 4000;

const db = new sqlite3.Database('users.db');

// Create users table (if not exists)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)");

  // Insert sample user data
  const sampleUserData = [
    { name: 'geeeeerard', email: 'geertje@example.com' },
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
    { creator_id: 1, name: 'Spaghetti Bolognese' },
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
app.post('/recipes', (req, res) => {
  const { creator_id, name } = req.body;
  if (!creator_id || !name) {
    res.status(400).json({ error: 'Please provide creator_id and name' });
    return;
  }
  db.run('INSERT INTO recipes (creator_id, name) VALUES (?, ?)', [creator_id, name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Recipe added', recipeId: this.lastID });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
