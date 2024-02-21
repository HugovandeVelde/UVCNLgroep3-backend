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
    db.run("DROP TABLE IF EXISTS friends");
  });

// Create users table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS friends (id INTEGER PRIMARY KEY AUTOINCREMENT, recieverID INTEGER, senderID INTEGER, status TEXT)"
  );

  // Insert sample user data
  const sampleUserData = [
    {
      recieverID: "1",
      senderID: "2",
      status: "accepted",
    },
    {
      recieverID: "1",
      senderID: "3",
      status: "pending",
    },
    {
      recieverID: "2",
      senderID: "4",
      status: "accepted",
    }
  ];

  const insertUserStatement = db.prepare(
    "INSERT INTO friends (recieverID, senderID, status) VALUES (?, ?, ?)"
  );

  for (const data of sampleUserData) {
    insertUserStatement.run(data.recieverID, data.senderID, data.status);
  }

  insertUserStatement.finalize();
});

//GET
app.get("/friends", (req, res) => {
  db.all("SELECT * FROM friends", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  }); 
});

//POST
app.post("/friends", (req, res) => {
  db.run(
    "INSERT INTO friends  (recieverID, senderID, status) VALUES (?, ?, ?)",
    [recieverID, senderID, status],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Request added"});
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});