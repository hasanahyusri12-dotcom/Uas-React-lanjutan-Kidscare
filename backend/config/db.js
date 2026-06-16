import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// HAPUS ATAU KOMENTARI BAGIAN INI:
/*
db.on("connect", () => {
  console.log("Database PostgreSQL berhasil terhubung ke:", process.env.DB_NAME);
});
*/

// Cukup lakukan log satu kali saja di sini jika ingin memastikan:
console.log("Konfigurasi Pool Database berhasil dimuat.");

export default db;