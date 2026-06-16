import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { db } from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import anakRoutes from "../routes/anakRoutes.js";
import janjiTemuRoutes from "../routes/janjiTemuRoutes.js";
import rekamMedisRoutes from "../routes/rekamMedisRoutes.js";
import dokterRoutes from "../routes/dokterRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, // WAJIB ada agar cookie/token terbaca
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// DAFTAR RUTE UTAMA API (FULL CRUD)
app.use("/api/auth", authRoutes);
app.use("/api/anak", anakRoutes);
app.use("/api/janji-temu", janjiTemuRoutes);
app.use("/api/rekam-medis", rekamMedisRoutes);
app.use("/api/dokter", dokterRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KidsCare API Running 🚀",
  });
});

// TEST KONEKSI DATABASE
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
