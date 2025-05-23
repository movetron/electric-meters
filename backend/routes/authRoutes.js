const express = require("express");
const router = express.Router();
const pool = require("../db");

// Авторизация пользователя или админа
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  try {
    const userQuery = 
      SELECT id, username, 'user' AS role FROM users WHERE username = $1 AND password = $2
      UNION 
      SELECT id, username, 'admin' AS role FROM admins WHERE username = $1 AND password = $2
    ;

    const result = await pool.query(userQuery, [username, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
    }

    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    console.error("Ошибка при авторизации:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;