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
  port: 3307,
  database: "hospital_management",
  dateStrings: true,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed" + err);
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
          message: err.sqlMessage || "Registration failed",
        });
      } else {
        res.send({ success: true, message: "User added successfully" });
      }
    },
  );
});

app.get("/users", (req, res) => {
  console.log("here");
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
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
    [id, name, specialization, dept, phone, email, status],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).json({
          success: false,
          message: err.sqlMessage || "DOctor Entry Failed",
        });
      } else {
        res.send({ success: true, message: "Doctor Added Successfully" });
      }
    },
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

app.put("/update-doctor/:id", (req, res) => {
  console.log("PUT /update-doctor/:id hit — id:", req.params.id);
  const { name, specialization, dept, phone, email, status } = req.body;
  db.query(
    "UPDATE doctors SET name = ?, specialization = ?, dept = ?, phone = ?, email = ?, status = ? WHERE id = ?",
    [name, specialization, dept, phone, email, status, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(400).json({
          success: false,
          message: err.sqlMessage || "Doctor Update Failed",
        });
      } else {
        res.send({ success: true, message: "Doctor Updated Successfully" });
      }
    },
  );
});

/// ------PATIENTS PART-------
// GET ALL PATIENTS
// AFTER — format admission date as plain YYYY-MM-DD string
app.get("/patients", (req, res) => {
  db.query("SELECT *, DATE_FORMAT(admission, '%Y-%m-%d') AS admission FROM patients", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});
// ADD PATIENT (MANUAL ID)
app.post("/add-patient", (req, res) => {
  const { id, name, age, disease, doctor, admission, status } = req.body;

  // Check if ID is missing before hitting the DB
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const sql = `
        INSERT INTO patients (id, name, age, disease, doctor, admission, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [id, name, age, disease, doctor, admission, status],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err.sqlMessage);
        return res.status(500).json({ error: err.sqlMessage });
      }
      res.json("Patient added successfully");
    },
  );
});

// UPDATE PATIENT
app.put("/update-patient/:id", (req, res) => {
  const id = req.params.id;
  const { name, age, disease, doctor, admission, status } = req.body;

  const sql = `
        UPDATE patients 
        SET name=?, age=?, disease=?, doctor=?, admission=?, status=? 
        WHERE id=?
    `;

  db.query(
    sql,
    [name, age, disease, doctor, admission, status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json("Patient updated");
    },
  );
});

// DELETE PATIENT
app.delete("/delete-patient/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM patients WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json("Patient deleted");
  });
});

// -------STAFF PART-------

app.get("/staff", (req, res) => {
    const sql = "SELECT * FROM staff";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

app.post("/add-staff", (req, res) => {
    const { id, name, role, phone, shift, status } = req.body;

    const sql = `
        INSERT INTO staff (id, name, role, phone, shift, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [id, name, role, phone, shift, status],
        (err, result) => {
            if (err) {
                console.log("Add Staff Error:", err);
                return res.status(500).json(err);
            }
            res.json("Staff added successfully");
        }
    );
});

app.put("/update-staff/:id", (req, res) => {
    const id = req.params.id;
    const { name, role, phone, shift, status } = req.body;

    const sql = `
        UPDATE staff 
        SET name=?, role=?, phone=?, shift=?, status=?
        WHERE id=?
    `;

    db.query(sql, [name, role, phone, shift, status, id],
        (err, result) => {
            if (err) {
                console.log("Update Staff Error:", err);
                return res.status(500).json(err);
            }
            res.json("Staff updated successfully");
        }
    );
});

app.delete("/delete-staff/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM staff WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log("Delete Staff Error:", err);
            return res.status(500).json(err);
        }
        res.json("Staff deleted successfully");
    });
});
// ── Start Server ──
app.listen(5000, () => {
  console.log("Server running on port 5000");
});