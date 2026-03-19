const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port:3307,
  database: "hospital_management"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed"+err);
  } else {
    console.log("MySQL Connected");
  }
});

//Register

app.post("/add-user", (req, res) => {
  const { id, email, password } = req.body;

  db.query(
    "INSERT INTO users (id , email, password) VALUES (?, ?, ?)",
    [id, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).json({
          success: false,
          message: err.sqlMessage || "Registration failed"
        });
      } else {
        res.send({ success: true, message: "User added successfully" });
      }
    }
  );
});

app.get("/users", (req, res) => {
    console.log('here');
  db.query("SELECT * FROM users", (err, result) => {
    
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});


// Admin

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.json({ success: false, message: "Database error" });
    }

    if (result.length === 0) {
      return res.json({ success: false, message: "Email not found" });
    }

    const user = result[0];

    // Compare password directly (simple version)
    if (password === user.password) {
      res.json({
        success: true,
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  });
});



// Admin Page 
/// * doctor part 

app.post("/add-doctor", (req, res) => {
  const { id, name, specialization, dept, phone, email, status } = req.body;

  db.query(
    "INSERT INTO doctors ( id, name, specialization, dept, phone, email, status ) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [ id, name, specialization, dept, phone, email, status ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).json({
          success: false,
          message: err.sqlMessage || "DOctor Entry Failed"
        });
      } else {
        res.send({ success: true, message: "Doctor Added Successfully" });
      }
    }
  );
});

app.get("/doctors", (req, res) => {
  db.query("SELECT * FROM doctors", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

app.delete("/delete-doctor/:id", (req, res) => {
  db.query("DELETE FROM doctors WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send({ message: "Deleted" });
  });
});