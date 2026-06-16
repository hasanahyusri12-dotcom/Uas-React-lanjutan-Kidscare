import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

// REGISTRASI USER
export const register = async (req, res) => {
  try {
    const { nama, email, kata_sandi, peran, spesialisasi, jadwal_praktik } = req.body;

    if (!["orang_tua", "dokter", "admin"].includes(peran)) {
      return res.status(400).json({ success: false, message: "Peran tidak valid." });
    }

    const cekEmail = await db.query("SELECT * FROM pengguna WHERE email = $1", [email]);
    if (cekEmail.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email sudah digunakan" });
    }

    const hashPassword = await bcrypt.hash(kata_sandi, 10);
    const penggunaBaru = await db.query(`INSERT INTO pengguna (nama, email, kata_sandi, peran) VALUES ($1, $2, $3, $4) RETURNING id`, [nama, email, hashPassword, peran]);

    const penggunaId = penggunaBaru.rows[0].id;
    if (peran === "dokter") {
      await db.query(`INSERT INTO dokter (pengguna_id, spesialisasi, jadwal_praktik) VALUES ($1, $2, $3)`, [penggunaId, spesialisasi, jadwal_praktik || null]);
    }

    res.status(201).json({ success: true, message: "Registrasi berhasil" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, kata_sandi } = req.body;
    const result = await db.query("SELECT * FROM pengguna WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Email tidak ditemukan" });
    }

    const user = result.rows[0];
    const cocok = await bcrypt.compare(kata_sandi, user.kata_sandi);

    if (!cocok) {
      return res.status(401).json({ success: false, message: "Password salah" });
    }

    const token = jwt.sign({ id: user.id, peran: user.peran }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // KUNCI: sameSite diubah ke 'lax' agar cookie terbaca saat refresh
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login berhasil",
        user: { id: user.id, nama: user.nama, email: user.email, peran: user.peran },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfil = async (req, res) => {
  try {
    const { nama, no_hp } = req.body;
    if (!nama) return res.status(400).json({ success: false, message: "Nama wajib diisi" });

    await db.query(
      "UPDATE pengguna SET nama = $1, no_hp = $2 WHERE id = $3",
      [nama, no_hp || null, req.user.id]
    );

    const result = await db.query(
      "SELECT id, nama, email, peran, no_hp FROM pengguna WHERE id = $1",
      [req.user.id]
    );

    res.json({ success: true, message: "Profil berhasil diperbarui", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Berhasil logout" });
};

// GET ME - Digunakan untuk cek status saat Refresh
export const getMe = async (req, res) => {
  try {
    // req.user diisi oleh middleware verifyToken
    const result = await db.query(
      // Jadi:
      "SELECT id, nama, email, peran, no_hp FROM pengguna WHERE id = $1", [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
