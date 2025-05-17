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

app.listen(5000, () => console.log("Сервер запущен на порту 5000"));
