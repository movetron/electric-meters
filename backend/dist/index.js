"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("../src/db"));
const garageRoutes = require("./src/routes/garageRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Роуты
app.use("/api/garages", garageRoutes);
// Получить все гаражи
app.get("/api/garages", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM garages");
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка при получении данных гаражей" });
    }
}));
// Обновить статус гаража
app.put("/api/garages/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        yield db_1.default.query("UPDATE garages SET status = $1 WHERE id = $2", [status, id]);
        res.json({ message: "Статус гаража обновлен" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка при обновлении статуса гаража" });
    }
}));
// Получить показания счётчиков
app.get("/api/meters/:garageId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { garageId } = req.params;
    try {
        const result = yield db_1.default.query("SELECT * FROM meters WHERE garage_id = $1", [garageId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
}));
// Добавить транзакцию
app.post("/api/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { garageId, amount, type } = req.body;
    try {
        yield db_1.default.query("INSERT INTO transactions (garage_id, amount, type) VALUES ($1, $2, $3)", [garageId, amount, type]);
        res.status(201).send("Транзакция добавлена");
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Ошибка сервера");
    }
}));
const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
