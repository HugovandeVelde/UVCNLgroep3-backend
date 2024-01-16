import express from "express";
import sqlite3 from "sqlite3";

const app = express();
const port = 4006;

const db = new sqlite3.Database("users.db");

// Middleware to allow all origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Drop existing tables
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS recipes");
  db.run("DROP TABLE IF EXISTS ingredients");
  db.run("DROP TABLE IF EXISTS recipeSteps");
});

// Create users table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS recipeSteps (id INTEGER PRIMARY KEY AUTOINCREMENT, recipeId INTEGER, instructie TEXT, stepNr INTEGER)"
  );

  // Insert sample user data
  const sampleUserData = [
    {
      recipeId: "1",
      instructie: "Kook spaghetti volgens de aanwijzingen op de verpakking.",
      stepNr: "1",
    },
    {
      recipeId: "1",
      instructie:
        "Verhit olie in een pan, bak gehakt rul. Voeg gesnipperde ui en knoflook toe.",
      stepNr: "2",
    },
    {
      recipeId: "1",
      instructie:
        "Voeg tomatensaus, tomatenpuree, Italiaanse kruiden, zout en peper toe. Laat sudderen.",
      stepNr: "3",
    },
    {
      recipeId: "1",
      instructie: "Serveer de saus over de gekookte spaghetti.",
      stepNr: "4",
    },
    {
      recipeId: "2",
      instructie: "Kook fettuccine volgens de instructies op de verpakking.",
      stepNr: "1",
    },
    {
      recipeId: "2",
      instructie:
        "Bak stukjes kip in boter tot ze gaar zijn. Voeg room en geraspte Parmezaanse kaas toe.",
      stepNr: "2",
    },
    {
      recipeId: "2",
      instructie:
        "Roer tot de kaas gesmolten is en de saus is ingedikt. Meng met de gekookte fettuccine.",
      stepNr: "3",
    },
    {
      recipeId: "3",
      instructie: "Kook spaghetti en bak spekjes krokant.",
      stepNr: "1",
    },
    {
      recipeId: "3",
      instructie: "Meng eieren, geraspte Parmezaanse kaas en peper in een kom.",
      stepNr: "2",
    },
    {
      recipeId: "3",
      instructie:
        "Giet de gekookte spaghetti af, meng met de spekjes en roer het eimengsel erdoor.",
      stepNr: "3",
    },
    {
      recipeId: "4",
      instructie: "Snijd kip in reepjes en roerbak in olie tot ze gaar zijn.",
      stepNr: "1",
    },
    {
      recipeId: "4",
      instructie:
        "Voeg gesneden groenten toe (bijv. broccoli, paprika, wortels).",
      stepNr: "2",
    },
    {
      recipeId: "4",
      instructie:
        "Voeg sojasaus, gember en knoflook toe. Roerbak tot de groenten knapperig zijn.",
      stepNr: "3",
    },
    {
      recipeId: "5",
      instructie: "Rol pizzadeeg uit op een bakplaat.",
      stepNr: "1",
    },
    {
      recipeId: "5",
      instructie:
        "Bestrijk met tomatensaus, beleg met plakjes mozzarella en tomaten.",
      stepNr: "2",
    },
    {
      recipeId: "5",
      instructie:
        "Besprenkel met olijfolie, voeg zout en basilicum toe. Bak volgens de instructies op het deegpakket.",
      stepNr: "3",
    },
    {
      recipeId: "6",
      instructie: "Bak groenten zoals paprika, ui, champignons.",
      stepNr: "1",
    },
    {
      recipeId: "6",
      instructie: "Voeg bonen toe en breng op smaak met taco-kruiden.",
      stepNr: "2",
    },
    {
      recipeId: "6",
      instructie:
        "Vul tacos met het groentenmengsel en voeg toppings toe zoals sla, tomaat, kaas en guacamole.",
      stepNr: "3",
    },
  ];

  const insertUserStatement = db.prepare(
    "INSERT INTO recipeSteps (recipeId, instructie, stepNr) VALUES (?, ?, ?)"
  );

  for (const data of sampleUserData) {
    insertUserStatement.run(data.recipeId, data.instructie, data.stepNr);
  }

  insertUserStatement.finalize();
});

// Create users table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)"
  );

  // Insert sample user data
  const sampleUserData = [
    { name: "Alice", email: "alice@example.com", password: "Alice" },
    { name: "Bob", email: "bob@example.com", password: "Bob" },
    { name: "Charlie", email: "charlie@example.com", password: "Charlie" },
    { name: "Klaasie", email: "klaasie@example.com", password: "Klaasie" },
    { name: "geerard", email: "geerard@example.com", password: "Geerard" },
  ];

  const insertUserStatement = db.prepare(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
  );

  for (const data of sampleUserData) {
    insertUserStatement.run(data.name, data.email, data.password);
  }

  insertUserStatement.finalize();
});

// Create recipes table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, creator_id INTEGER, name TEXT, prepTime TEXT, energy TEXT, fat TEXT, carbohydrate TEXT, proteine TEXT, kitchenware TEXT)"
  );

  // Insert sample recipe data
  const sampleRecipeData = [
    {
      creator_id: 1,
      name: "Spaghetti Bolognese",
      prepTime: "30 minuten",
      energy: "500 kcal",
      fat: "20 g",
      carbohydrate: "60 g",
      protein: "25 g",
      kitchenware: "Benodigdheden: grote pan, koekenpan"
    },
    {
      creator_id: 2,
      name: "Chicken Alfredo",
      prepTime: "25 minuten",
      energy: "600 kcal",
      fat: "30 g",
      carbohydrate: "45 g",
      protein: "40 g",
      kitchenware: "Benodigdheden: grote pan, koekenpan"
    },
    {
      creator_id: 1,
      name: "Spaghetti Carbonara",
      prepTime: "20 minuten",
      energy: "550 kcal",
      fat: "25 g",
      carbohydrate: "50 g",
      protein: "30 g",
      kitchenware: "Benodigdheden: grote pan, koekenpan"
    },
    {
      creator_id: 3,
      name: "Chicken Stir-Fry",
      prepTime: "15 minuten",
      energy: "400 kcal",
      fat: "15 g",
      carbohydrate: "40 g",
      protein: "35 g",
      kitchenware: "Benodigdheden: wokpan"
    },
    {
      creator_id: 4,
      name: "Margherita Pizza",
      prepTime: "40 minuten",
      energy: "700 kcal",
      fat: "30 g",
      carbohydrate: "65 g",
      protein: "25 g",
      kitchenware: "Benodigdheden: bakplaat, deegroller"
    },
    {
      creator_id: 5,
      name: "Vegetarian Tacos",
      prepTime: "20 minuten",
      energy: "450 kcal",
      fat: "20 g",
      carbohydrate: "40 g",
      protein: "15 g",
      kitchenware: "Benodigdheden: koekenpan"
    },
  ];

  const insertRecipeStatement = db.prepare(
    "INSERT INTO recipes (creator_id, name, prepTime, energy, fat, carbohydrate, proteine, kitchenware) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );

  for (const data of sampleRecipeData) {
    insertRecipeStatement.run(data.creator_id, data.name, data.prepTime, data.energy, data.fat, data.carbohydrate, data.protein, data.kitchenware);
  }

  insertRecipeStatement.finalize();
});

// Create ingredients table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS ingredients (ingredientId INTEGER PRIMARY KEY AUTOINCREMENT, recipeId INTEGER, Hoeveelheid TEXT, ingredientName TEXT)"
  );

  // Insert sample ingredient data
  const sampleIngredientData = [
    { recipeId: 1, Hoeveelheid: "200g", ingredientName: "Spaghetti" },
    { recipeId: 1, Hoeveelheid: "300g", ingredientName: "Gehakt" },
    { recipeId: 1, Hoeveelheid: "1 cup", ingredientName: "Tomaten saus" },
    { recipeId: 2, Hoeveelheid: "250g", ingredientName: "Kip filet" },
    { recipeId: 2, Hoeveelheid: "1 cup", ingredientName: "Alfredo sauce" },
    { recipeId: 2, Hoeveelheid: "200g", ingredientName: "Fettuccine pasta" },
    { recipeId: 3, Hoeveelheid: "200g", ingredientName: "Spaghetti" },
    { recipeId: 3, Hoeveelheid: "300g", ingredientName: "Gehakt" },
    { recipeId: 3, Hoeveelheid: "1 cup", ingredientName: "Tomaten saus" },
    { recipeId: 4, Hoeveelheid: "250g", ingredientName: "Chicken breast" },
    { recipeId: 4, Hoeveelheid: "1 cup", ingredientName: "Alfredo sauce" },
    { recipeId: 4, Hoeveelheid: "200g", ingredientName: "Fettuccine pasta" },
    { recipeId: 5, Hoeveelheid: "1", ingredientName: "Pizzadeeg" },
    { recipeId: 5, Hoeveelheid: "1 cup", ingredientName: "Tomatensaus" },
    { recipeId: 5, Hoeveelheid: "200g", ingredientName: "Mozzarella kaas" },
    { recipeId: 5, Hoeveelheid: "Verse", ingredientName: "basilicumblaadjes" },
    { recipeId: 5, Hoeveelheid: "Naar smaak", ingredientName: "Olijfolie" },
    { recipeId: 5, Hoeveelheid: "Naar smaak", ingredientName: "Zout en peper" },
    { recipeId: 6, Hoeveelheid: "1 blik", ingredientName: "Zwarte bonen" },
    { recipeId: 6, Hoeveelheid: "1 blik", ingredientName: "Maïs" },
    { recipeId: 6, Hoeveelheid: "2", ingredientName: "Tomaten" },
    { recipeId: 6, Hoeveelheid: "1", ingredientName: "Avocado" },
    { recipeId: 6, Hoeveelheid: "1", ingredientName: "Rode ui" },
    { recipeId: 6, Hoeveelheid: "8", ingredientName: "Tortillas" },
    { recipeId: 6, Hoeveelheid: "1 theelepel", ingredientName: "Komijn" },
    { recipeId: 6, Hoeveelheid: "Naar smaak", ingredientName: "Koriander" },
  ];

  const insertIngredientStatement = db.prepare(
    "INSERT INTO ingredients (recipeId, Hoeveelheid, ingredientName) VALUES (?, ?, ?)"
  );

  for (const data of sampleIngredientData) {
    insertIngredientStatement.run(
      data.recipeId,
      data.Hoeveelheid,
      data.ingredientName
    );
  }

  insertIngredientStatement.finalize();
});

app.use(express.json());

// Get all users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new user
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Please provide name, email, and password" });
    return;
  }
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "User added", userId: this.lastID });
    }
  );
});

// Get all ingredients
app.get("/ingredients", (req, res) => {
  db.all("SELECT * FROM ingredients", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  }); 
});

// Get all steps
app.get("/steps", (req, res) => {
  db.all("SELECT * FROM recipeSteps", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all recipes
app.get("/recipes", (req, res) => {
  db.all("SELECT * FROM recipes", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new recipe
app.post("/recipes", (req, res) => {
  const { creator_id, name } = req.body;
  if (!creator_id || !name) {
    res.status(400).json({ error: "Please provide creator_id and name" });
    return;
  }
  db.run(
    "INSERT INTO recipes (creator_id, name) VALUES (?, ?)",
    [creator_id, name],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Recipe added", recipeId: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
