import express from "express";
import { buatRekamMedis, getRekamMedis, getDetailRekamMedis, updateRekamMedis, hapusRekamMedis } from "../controllers/rekamMedisController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", buatRekamMedis);             // CREATE
router.get("/", getRekamMedis);               // READ ALL
router.get("/:id", getDetailRekamMedis);     // READ DETAIL
router.put("/:id", updateRekamMedis);         // UPDATE
router.delete("/:id", hapusRekamMedis);       // DELETE

export default router;