import express from 'express';
import sqlite3 from 'sqlite3';
 
const app = express();
const port = 4003;
 
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
 
// Create recipes table (if not exists)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS ingredients (ingredientId INTEGER PRIMARY KEY AUTOINCREMENT, recipeId INTEGER, Hoeveelheid TEXT, ingredientName TEXT)");
 
  // Insert sample recipe data
  const sampleRecipeData = [
    { },
  ];
 
  const insertRecipeStatement = db.prepare('INSERT INTO ingredients (ingredientId, recipeId, Hoeveelheid, ingredientName) VALUES (?, ?, ?, ?)');
 
  for (const data of sampleRecipeData) {
    insertRecipeStatement.run(data.ingredientId, data.recipeId, data.Hoeveelheid, data.ingredientName);
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
// Get all ingredient
app.get('/ingredients', (req, res) => {
  db.all('SELECT * FROM recipeIngredients', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
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