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


// -------APPOINTMENTS PART-------

// GET ALL APPOINTMENTS
app.get("/appointments", (req, res) => {
  db.query("SELECT * FROM appointments", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

// ADD
app.post("/add-appointment", (req, res) => {
  const { id, patient, doctor, date, time, status } = req.body;

  db.query(
    "INSERT INTO appointments (id, patient, doctor, date, time, status) VALUES (?, ?, ?, ?, ?, ?)",
    [id, patient, doctor, date, time, status],
    (err, result) => {
      if (err) return res.status(400).send(err);
      res.send("Appointment added");
    }
  );
});

// UPDATE
app.put("/update-appointment/:id", (req, res) => {
  const { patient, doctor, date, time, status } = req.body;

  db.query(
    "UPDATE appointments SET patient=?, doctor=?, date=?, time=?, status=? WHERE id=?",
    [patient, doctor, date, time, status, req.params.id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Updated");
    }
  );
});

// DELETE
app.delete("/delete-appointment/:id", (req, res) => {
  db.query(
    "DELETE FROM appointments WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Deleted");
    }
  );
});

// STATUS UPDATE (IMPORTANT)
app.put("/update-appointment-status/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE appointments SET status=? WHERE id=?",
    [status, req.params.id],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Status updated");
    }
  );
});
// ── DEPARTMENTS PART ──

// GET ALL DEPARTMENTS
app.get("/departments", (req, res) => {
  db.query("SELECT * FROM departments", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD DEPARTMENT
app.post("/add-department", (req, res) => {
  const { id, name, head, beds, occupied } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "ID and Name are required" });
  }

  const sql = `
    INSERT INTO departments (id, name, head, beds, occupied)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [Number(id), name, head || null, Number(beds) || 0, Number(occupied) || 0],
    (err, result) => {
      if (err) {
        console.error("Add Department Error:", err.sqlMessage);
        return res.status(500).json({ error: err.sqlMessage });
      }
      res.json({ success: true, message: "Department added successfully" });
    }
  );
});

// DELETE DEPARTMENT
app.delete("/delete-department/:id", (req, res) => {
  db.query("DELETE FROM departments WHERE id = ?", [Number(req.params.id)], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Department deleted" });
  });
});


// ── BILLING PART ──
// GET ALL BILLS
app.get("/billing", (req, res) => {
  db.query("SELECT * FROM billing", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD BILL
app.post("/add-bill", (req, res) => {
  const { id, patient, treatment, amount, status } = req.body;

  if (!id || !patient) {
    return res.status(400).json({ error: "ID and Patient are required" });
  }

  const sql = `
    INSERT INTO billing (id, patient, treatment, amount, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id, patient, treatment, amount, status || "Pending"], (err, result) => {
    if (err) {
      console.error("Add Bill Error:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.json({ success: true, message: "Bill added successfully" });
  });
});

// UPDATE BILL
app.put("/update-bill/:id", (req, res) => {
  const { patient, treatment, amount, status } = req.body;

  const sql = `
    UPDATE billing 
    SET patient=?, treatment=?, amount=?, status=?
    WHERE id=?
  `;

  db.query(sql, [patient, treatment, amount, status, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Bill updated successfully" });
  });
});

// DELETE BILL
app.delete("/delete-bill/:id", (req, res) => {
  db.query("DELETE FROM billing WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Bill deleted" });
  });
});

// UPDATE BILL STATUS ONLY
app.put("/update-bill-status/:id", (req, res) => {
  const { status } = req.body;

  db.query(
    "UPDATE billing SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, message: "Status updated" });
    }
  );
});

// ── STAFF TASKS PART ──

// GET ALL TASKS
app.get("/staff-tasks", (req, res) => {
    db.query("SELECT * FROM staff_tasks ORDER BY created_at DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// ADD TASK
app.post("/add-staff-task", (req, res) => {
    const { id, title, description, priority, status, assigned_to } = req.body;

    if (!id || !title) {
        return res.status(400).json({ error: "ID and Title are required" });
    }

    const sql = `
        INSERT INTO staff_tasks (id, title, description, priority, status, assigned_to)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [id, title, description || "", priority || "Medium", status || "Pending", assigned_to || ""], (err) => {
        if (err) {
            console.log("Add Task Error:", err);
            return res.status(500).json(err);
        }
        res.json({ success: true, message: "Task added successfully" });
    });
});

// UPDATE TASK
app.put("/update-staff-task/:id", (req, res) => {
    const id = req.params.id;
    const { title, description, priority, status, assigned_to } = req.body;

    const sql = `
        UPDATE staff_tasks 
        SET title=?, description=?, priority=?, status=?, assigned_to=?
        WHERE id=?
    `;

    db.query(sql, [title, description, priority, status, assigned_to, id], (err) => {
        if (err) {
            console.log("Update Task Error:", err);
            return res.status(500).json(err);
        }
        res.json({ success: true, message: "Task updated successfully" });
    });
});

// DELETE TASK
app.delete("/delete-staff-task/:id", (req, res) => {
    db.query("DELETE FROM staff_tasks WHERE id=?", [req.params.id], (err) => {
        if (err) {
            console.log("Delete Task Error:", err);
            return res.status(500).json(err);
        }
        res.json({ success: true, message: "Task deleted" });
    });
});
// ── Start Server ──
app.listen(5000, () => {
  console.log("Server running on port 5000");
});