const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // Require the bcrypt library
const db = require("../config/database");
const jwt = require('jsonwebtoken'); 

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM admin WHERE username = ?";

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials"});
    }

    const hashedPassword = results[0].password;

    bcrypt.compare(password, hashedPassword, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        console.error("Error comparing passwords:", bcryptErr);
        return res.status(500).json({ error: "Password comparison error" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      
      const token = jwt.sign({ userId: results[0].id }, 'f2$H#0pL&9A!zqNkR8TgYv3w5ZsXxUrZ', {
        expiresIn: '1h',
      });

      res.status(200).json({ message: "Login successful", token });
    });
  });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Prepare a SQL query to insert the admin user
    const query = "INSERT INTO admin (username, password) VALUES (?, ?)";

    // Execute the SQL query with the hashed password
    db.query(query, [username, hashedPassword], (err) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Successful registration
      res.status(200).json({ message: "Registration successful" });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    return res.status(500).json({ error: "Password hashing error" });
  }
});

// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Error destroying session:", err);
//         return res.status(500).json({ error: "Logout error" });
//       }
//       res.status(200).json({ message: "Logout successful" });
//     });
//   });

module.exports = router;
