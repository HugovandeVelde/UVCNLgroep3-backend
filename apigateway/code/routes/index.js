import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 4005;

const db = new sqlite3.Database('users.db');

// Middleware to allow all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Drop existing tables
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS recipes");
  db.run("DROP TABLE IF EXISTS ingredients");
});

// Create users table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)");

  // Insert sample user data
  const sampleUserData = [
    { name: 'Alice', email: 'alice@example.com', password: 'Alice' },
    { name: 'Bob', email: 'bob@example.com', password: 'Bob' },
    { name: 'Charlie', email: 'charlie@example.com', password: 'Charlie' },
    { name: 'Klaasie', email: 'klaasie@example.com', password: 'Klaasie' },
    { name: 'geerard', email: 'geerard@example.com', password: 'Geerard' },
  ];

  const insertUserStatement = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');

  for (const data of sampleUserData) {
    insertUserStatement.run(data.name, data.email, data.password);
  }

  insertUserStatement.finalize();
});

// Create recipes table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, creator_id INTEGER, name TEXT)");

  // Insert sample recipe data
  const sampleRecipeData = [
    { creator_id: 1, name: 'Spaghetti Bolognese' },
    { creator_id: 2, name: 'Chicken Alfredo' },
  ];

  const insertRecipeStatement = db.prepare('INSERT INTO recipes (creator_id, name) VALUES (?, ?)');

  for (const data of sampleRecipeData) {
    insertRecipeStatement.run(data.creator_id, data.name);
  }

  insertRecipeStatement.finalize();
});

// Create ingredients table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS ingredients (ingredientId INTEGER PRIMARY KEY AUTOINCREMENT, recipeId INTEGER, Hoeveelheid TEXT, ingredientName TEXT)");

  // Insert sample ingredient data
  const sampleIngredientData = [
    { recipeId: 1, Hoeveelheid: '200g', ingredientName: 'Spaghetti' },
    { recipeId: 1, Hoeveelheid: '300g', ingredientName: 'Ground beef' },
    { recipeId: 1, Hoeveelheid: '1 cup', ingredientName: 'Tomato sauce' },
    { recipeId: 2, Hoeveelheid: '250g', ingredientName: 'Chicken breast' },
    { recipeId: 2, Hoeveelheid: '1 cup', ingredientName: 'Alfredo sauce' },
    { recipeId: 2, Hoeveelheid: '200g', ingredientName: 'Fettuccine pasta' },
  ];

  const insertIngredientStatement = db.prepare('INSERT INTO ingredients (recipeId, Hoeveelheid, ingredientName) VALUES (?, ?, ?)');

  for (const data of sampleIngredientData) {
    insertIngredientStatement.run(data.recipeId, data.Hoeveelheid, data.ingredientName);
  }

  insertIngredientStatement.finalize();
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
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Please provide name, email, and password' });
    return;
  }
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User added', userId: this.lastID });
  });
});

// Get all ingredients
app.get('/ingredients', (req, res) => {
  db.all('SELECT * FROM ingredients', (err, rows) => {
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
