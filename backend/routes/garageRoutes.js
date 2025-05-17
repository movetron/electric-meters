const express = require("express");
const router = express.Router();
const pool = require("../db");

// Получение всех гаражей
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM garages");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
// Обновить статус гаража
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE garages SET status = $1 WHERE id = $2", [status, id]);
    res.json({ message: "Статус гаража обновлён" });
  } catch (err) {
    console.error("Ошибка обновления статуса:", err);
    res.status(500).json({ error: "Ошибка при обновлении гаража" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM garages WHERE id = $1", [id]);
    res.json({ message: "Гараж удалён" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при удалении гаража" });
  }
});
// Добавление нового гаража
router.post("/", async (req, res) => {
  const { energy, balance, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO garages (energy, balance, status) VALUES ($1, $2, $3) RETURNING *",
      [energy, balance, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
