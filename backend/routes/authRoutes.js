import express from "express";
import { register, login, logout, getMe, updateProfil } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe); 
router.put("/profil", verifyToken, updateProfil);

// PASTIKAN BARIS INI ADA DI PALING BAWAH
export default router;
