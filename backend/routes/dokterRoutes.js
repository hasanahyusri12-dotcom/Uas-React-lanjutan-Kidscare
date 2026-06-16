import express from "express";
import { getAllDokter, getDetailDokter, updateProfilDokter, hapusDokter } from "../controllers/dokterController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dokter         -> Semua user bisa lihat daftar dokter (tidak perlu login)
router.get("/", getAllDokter);

// GET /api/dokter/:id     -> Semua user bisa lihat detail dokter
router.get("/:id", getDetailDokter);

// PUT /api/dokter/profil-saya -> Hanya dokter yang login yang bisa update profilnya
// ⚠️ PENTING: Rute statis "/profil-saya" harus didaftarkan SEBELUM rute dinamis "/:id"
// agar Express tidak salah tangkap "profil-saya" sebagai sebuah :id
router.put("/profil-saya", verifyToken, updateProfilDokter);

// DELETE /api/dokter/:id  -> Hanya admin yang boleh (validasi peran bisa ditambah di controller)
router.delete("/:id", verifyToken, hapusDokter);

export default router;
