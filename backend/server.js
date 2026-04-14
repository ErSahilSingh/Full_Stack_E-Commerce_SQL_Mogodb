require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const { pool } = require("./config/db");

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("mongo ok");
  await pool.query("SELECT 1");
  console.log("mysql ok");
  const port = Number(process.env.PORT) || 5050;
  await new Promise((resolve, reject) => {
    const server = app.listen(port, resolve);
    server.on("error", reject);
  });
  console.log("listening on", port);
};

start().catch((err) => {
  const msg = err.message || String(err);
  console.error(msg || err);
  if (err.code === "ECONNREFUSED") {
    console.error("mysql connection refused — is mysqld running?");
  }
  process.exit(1);
});
