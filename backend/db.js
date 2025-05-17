const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Meters",
  password: "89640832608movka",
  port: 5432,
});

module.exports = pool;
