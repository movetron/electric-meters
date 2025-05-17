// src/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000", // ← УКАЗЫВАЕМ ПРАВИЛЬНЫЙ БАЗОВЫЙ URL
});

export default apiClient;