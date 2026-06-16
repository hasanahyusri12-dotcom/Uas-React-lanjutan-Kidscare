import express from "express";
import { 
  buatJanjiTemu, 
  getJanjiTemu, 
  getDetailJanjiTemu, 
  updateStatusJanji 
} from "../controllers/janjiTemuController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua operasi rute wajib terverifikasi login
router.use(verifyToken);

// Rute Janji Temu
router.post("/", buatJanjiTemu);              // Buat janji
router.get("/", getJanjiTemu);               // List janji (Dashboard)
router.get("/:id", getDetailJanjiTemu);      // Detail janji spesifik
router.put("/:id/status", updateStatusJanji); // Update status (Disetujui/Selesai/Dibatalkan)

// [OPSIONAL] Tambahan: Jika nanti ada fitur hapus janji, tambahkan di bawah ini:
// router.delete("/:id", deleteJanjiTemu);

export default router;