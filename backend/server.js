const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Роуты
const garageRoutes = require("./routes/garageRoutes");
app.use("/api/garages", garageRoutes);



app.get("/api/meters/garages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM meters WHERE garage_id = $1", [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { garageId, amount, type } = req.body;
    await pool.query("INSERT INTO transactions (garage_id, amount, type) VALUES ($1, $2, $3)", [garageId, amount, type]);
    res.status(201).send("Транзакция добавлена");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка сервера");
  }
});
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  try {
    const result = await pool.query(
      
      SELECT id, username, 'user' AS role FROM users WHERE username = $1 AND password = $2
      UNION
      SELECT id, username, 'admin' AS role FROM admins WHERE username = $1 AND password = $2
    ,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const user = result.rows[0];
    res.status(200).json(user);
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});
app.listen(5000, () => console.log("Сервер запущен на порту 5000"));
