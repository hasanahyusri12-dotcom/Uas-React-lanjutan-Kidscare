import { db } from "../config/db.js";

// 1. READ: AMBIL SEMUA DAFTAR DOKTER (Untuk Orang Tua saat mau pilih dokter)
// Endpoint: GET /api/dokter
export const getAllDokter = async (req, res) => {
  try {
    const query = `
      SELECT d.id AS dokter_id, p.nama, p.email, d.spesialisasi, d.jadwal_praktik
      FROM dokter d
      JOIN pengguna p ON d.pengguna_id = p.id
      ORDER BY p.nama ASC
    `;
    const result = await db.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. READ: AMBIL DETAIL SATU DOKTER BY ID
// Endpoint: GET /api/dokter/:id
export const getDetailDokter = async (req, res) => {
  try {
    const { id } = req.params; // ID Dokter
    const query = `
      SELECT d.id AS dokter_id, p.nama, p.email, d.spesialisasi, d.jadwal_praktik
      FROM dokter d
      JOIN pengguna p ON d.pengguna_id = p.id
      WHERE d.id = $1
    `;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Dokter tidak ditemukan" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. UPDATE: DOKTER MENGUBAH JADWAL / SPESIALISASINYA SENDIRI
// Endpoint: PUT /api/dokter/profil-saya
export const updateProfilDokter = async (req, res) => {
  try {
    const pengguna_id = req.user.id; // ID Pengguna dari token login
    const { spesialisasi, jadwal_praktik } = req.body;

    if (req.user.peran !== "dokter") {
      return res.status(403).json({ success: false, message: "Akses ditolak. Hanya untuk akun Dokter." });
    }

    // Jalankan query update menggunakan COALESCE agar aman jika hanya isi salah satu
    const result = await db.query(
      `
      UPDATE dokter 
      SET spesialisasi = COALESCE($1, spesialisasi), 
          jadwal_praktik = COALESCE($2, jadwal_praktik)
      WHERE pengguna_id = $3
      RETURNING *
      `,
      [spesialisasi, jadwal_praktik, pengguna_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data profil dokter tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Profil medis dokter berhasil diperbarui!",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE: HAPUS DATA DOKTER (Biasanya dilakukan oleh Admin)
// Endpoint: DELETE /api/dokter/:id
export const hapusDokter = async (req, res) => {
  try {
    const { id } = req.params; // ID Dokter

    // Karena relasi ON DELETE CASCADE, jika kita hapus pengguna_id-nya, 
    // data di tabel dokter otomatis ikut terhapus bersih.
    const ambilDokter = await db.query("SELECT pengguna_id FROM dokter WHERE id = $1", [id]);
    if (ambilDokter.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data dokter tidak ditemukan" });
    }

    const { pengguna_id } = ambilDokter.rows[0];
    await db.query("DELETE FROM pengguna WHERE id = $1", [pengguna_id]);

    res.json({ success: true, message: "Akun dan data praktik dokter berhasil dihapus dari sistem." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};