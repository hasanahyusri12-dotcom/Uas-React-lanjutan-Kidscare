import express from "express";
import { tambahAnak, getAnakSaya, getDetailAnak, updateAnak, hapusAnak } from "../controllers/anakController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua rute di bawah ini wajib login (ada cookie token)
router.use(verifyToken);

router.post("/", tambahAnak); // C - Create
router.get("/", getAnakSaya); // R - Read (Semua)
router.get("/:id", getDetailAnak); // R - Read (Detail satu anak)
router.put("/:id", updateAnak); // U - Update (Ubah data)
router.delete("/:id", hapusAnak); // D - Delete (Hapus data)

export default router;
