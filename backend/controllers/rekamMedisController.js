import { db } from "../config/db.js";

// ==========================================
// [POST] -> BUAT REKAM MEDIS BARU
// Digunakan oleh: Dokter
// Endpoint: POST /api/rekam-medis
// ==========================================
export const buatRekamMedis = async (req, res) => {
  try {
    if (req.user.peran !== "dokter") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya dokter yang dapat membuat rekam medis.",
      });
    }

    const { janji_temu_id, diagnosis, resep, tinggi_badan, berat_badan, catatan, tindakan, suhu, tekanan_darah } = req.body;
    // Validasi: Pastikan janji temu tersebut memang milik dokter yang sedang login
    const cekJanji = await db.query(
      `SELECT jt.* FROM janji_temu jt
       JOIN dokter d ON jt.dokter_id = d.id
       WHERE jt.id = $1 AND d.pengguna_id = $2`,
      [janji_temu_id, req.user.id],
    );

    if (cekJanji.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Janji temu tidak valid atau bukan milik Anda.",
      });
    }

    const result = await db.query(
      `INSERT INTO rekam_medis (
      janji_temu_id,
      diagnosis,
      resep,
      tinggi_badan,
      berat_badan,
      catatan,
      tindakan,
      suhu,
      tekanan_darah
    )
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
   RETURNING *`,
      [janji_temu_id, diagnosis, resep, tinggi_badan, berat_badan, catatan, tindakan, suhu, tekanan_darah],
    );
    // Setelah rekam medis dibuat, otomatis update status janji temu menjadi 'Selesai'
    await db.query("UPDATE janji_temu SET status = 'Selesai' WHERE id = $1", [janji_temu_id]);

    res.status(201).json({
      success: true,
      message: "Rekam medis berhasil dibuat dan status janji temu diperbarui menjadi Selesai.",
      data: result.rows[0],
    });
  } catch (error) {
    // Tangani error jika rekam medis untuk janji temu ini sudah ada (UNIQUE constraint)
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Rekam medis untuk janji temu ini sudah ada.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// [GET] -> AMBIL SEMUA REKAM MEDIS
// Digunakan oleh: Orang Tua (rekam medis anak-anaknya) & Dokter (rekam medis yang ia buat)
// Endpoint: GET /api/rekam-medis
// ==========================================
export const getRekamMedis = async (req, res) => {
  try {
    const { id, peran } = req.user;
    let query = "";
    let values = [];

    if (peran === "dokter") {
      query = `
        SELECT rm.*, 
               a.nama AS nama_anak, 
               p.nama AS nama_orang_tua,
               jt.tanggal_janji
        FROM rekam_medis rm
        JOIN janji_temu jt ON rm.janji_temu_id = jt.id
        JOIN anak a ON jt.anak_id = a.id
        JOIN pengguna p ON a.orang_tua_id = p.id
        JOIN dokter d ON jt.dokter_id = d.id
        WHERE d.pengguna_id = $1
        ORDER BY rm.dibuat_pada DESC
      `;
      values = [id];
    } 
    else if (peran === "admin") {
  query = `
    SELECT rm.*,
           a.nama AS nama_anak,
           p_dok.nama AS nama_dokter,
           d.spesialisasi,
           jt.tanggal_janji
    FROM rekam_medis rm
    JOIN janji_temu jt ON rm.janji_temu_id = jt.id
    JOIN anak a ON jt.anak_id = a.id
    JOIN dokter d ON jt.dokter_id = d.id
    JOIN pengguna p_dok ON d.pengguna_id = p_dok.id
    ORDER BY rm.dibuat_pada DESC
  `;
  values = [];
}
    else {
      // Orang tua: lihat rekam medis semua anak-anaknya
      query = `
        SELECT rm.*,
               a.nama AS nama_anak,
               p_dok.nama AS nama_dokter,
               d.spesialisasi,
               jt.tanggal_janji
        FROM rekam_medis rm
        JOIN janji_temu jt ON rm.janji_temu_id = jt.id
        JOIN anak a ON jt.anak_id = a.id
        JOIN dokter d ON jt.dokter_id = d.id
        JOIN pengguna p_dok ON d.pengguna_id = p_dok.id
        WHERE a.orang_tua_id = $1
        ORDER BY rm.dibuat_pada DESC
      `;
      values = [id];
    }

    const result = await db.query(query, values);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// [GET] -> AMBIL DETAIL SATU REKAM MEDIS
// Digunakan oleh: Orang Tua & Dokter
// Endpoint: GET /api/rekam-medis/:id
// ==========================================
export const getDetailRekamMedis = async (req, res) => {
  try {
    const { id: rekamId } = req.params;
    const { id: userId, peran } = req.user;

    let query = "";
    let values = [];

    if (peran === "dokter") {
      query = `
        SELECT rm.*,
               a.nama AS nama_anak,
               p.nama AS nama_orang_tua,
               jt.tanggal_janji
        FROM rekam_medis rm
        JOIN janji_temu jt ON rm.janji_temu_id = jt.id
        JOIN anak a ON jt.anak_id = a.id
        JOIN pengguna p ON a.orang_tua_id = p.id
        JOIN dokter d ON jt.dokter_id = d.id
        WHERE rm.id = $1 AND d.pengguna_id = $2
      `;
      values = [rekamId, userId];
    } else {
      query = `
        SELECT rm.*,
               a.nama AS nama_anak,
               p_dok.nama AS nama_dokter,
               d.spesialisasi,
               jt.tanggal_janji
        FROM rekam_medis rm
        JOIN janji_temu jt ON rm.janji_temu_id = jt.id
        JOIN anak a ON jt.anak_id = a.id
        JOIN dokter d ON jt.dokter_id = d.id
        JOIN pengguna p_dok ON d.pengguna_id = p_dok.id
        WHERE rm.id = $1 AND a.orang_tua_id = $2
      `;
      values = [rekamId, userId];
    }

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rekam medis tidak ditemukan atau Anda tidak memiliki hak akses.",
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// [PUT] -> PERBARUI REKAM MEDIS
// Digunakan oleh: Dokter (yang membuat rekam medis tersebut)
// Endpoint: PUT /api/rekam-medis/:id
// ==========================================
export const updateRekamMedis = async (req, res) => {
  try {
    if (req.user.peran !== "dokter") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya dokter yang dapat mengubah rekam medis.",
      });
    }

    const { id: rekamId } = req.params;
    const { diagnosis, resep, tinggi_badan, berat_badan, catatan, tindakan, suhu, tekanan_darah } = req.body;
    // Pastikan rekam medis ini memang milik dokter yang login
    const cekRekam = await db.query(
      `SELECT rm.id FROM rekam_medis rm
       JOIN janji_temu jt ON rm.janji_temu_id = jt.id
       JOIN dokter d ON jt.dokter_id = d.id
       WHERE rm.id = $1 AND d.pengguna_id = $2`,
      [rekamId, req.user.id],
    );

    if (cekRekam.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rekam medis tidak ditemukan atau Anda tidak memiliki hak akses.",
      });
    }

    const result = await db.query(
      `UPDATE rekam_medis
   SET diagnosis      = COALESCE($1, diagnosis),
       resep          = COALESCE($2, resep),
       tinggi_badan   = COALESCE($3, tinggi_badan),
       berat_badan    = COALESCE($4, berat_badan),
       catatan        = COALESCE($5, catatan),
       tindakan       = COALESCE($6, tindakan),
       suhu           = COALESCE($7, suhu),
       tekanan_darah  = COALESCE($8, tekanan_darah)
   WHERE id = $9
   RETURNING *`,
      [diagnosis, resep, tinggi_badan, berat_badan, catatan, tindakan, suhu, tekanan_darah, rekamId],
    );
    res.json({
      success: true,
      message: "Rekam medis berhasil diperbarui.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// [DELETE] -> HAPUS REKAM MEDIS
// Digunakan oleh: Dokter (yang membuat rekam medis tersebut)
// Endpoint: DELETE /api/rekam-medis/:id
// ==========================================
export const hapusRekamMedis = async (req, res) => {
  try {
    if (req.user.peran !== "dokter") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya dokter yang dapat menghapus rekam medis.",
      });
    }

    const { id: rekamId } = req.params;

    // Pastikan rekam medis ini milik dokter yang login sebelum dihapus
    const cekRekam = await db.query(
      `SELECT rm.id FROM rekam_medis rm
       JOIN janji_temu jt ON rm.janji_temu_id = jt.id
       JOIN dokter d ON jt.dokter_id = d.id
       WHERE rm.id = $1 AND d.pengguna_id = $2`,
      [rekamId, req.user.id],
    );

    if (cekRekam.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Rekam medis tidak ditemukan atau Anda tidak memiliki hak akses.",
      });
    }

    await db.query("DELETE FROM rekam_medis WHERE id = $1", [rekamId]);

    res.json({
      success: true,
      message: "Rekam medis berhasil dihapus.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
