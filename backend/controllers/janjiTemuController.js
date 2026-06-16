import { db } from "../config/db.js";

// 1. CREATE: BUAT JANJI TEMU BARU (Oleh Orang Tua)
export const buatJanjiTemu = async (req, res) => {
  try {
    // Menambahkan 'keluhan' ke dalam body
    const { anak_id, dokter_id, tanggal_janji, keluhan } = req.body;
    const orang_tua_id = req.user.id;

    const cekAnak = await db.query(
      "SELECT * FROM anak WHERE id = $1 AND orang_tua_id = $2", 
      [anak_id, orang_tua_id]
    );

    if (cekAnak.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Data anak tidak valid atau bukan milik Anda.",
      });
    }

    // Menambahkan 'keluhan' ke dalam query INSERT
    const result = await db.query(
      `
      INSERT INTO janji_temu (anak_id, dokter_id, tanggal_janji, keluhan)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [anak_id, dokter_id, tanggal_janji, keluhan]
    );

    res.status(201).json({
      success: true,
      message: "Janji temu berhasil dibuat. Menunggu konfirmasi dokter.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. READ ALL: LIHAT ALL JANJI TEMU
export const getJanjiTemu = async (req, res) => {
  try {
    const { id, peran } = req.user;
    let query = "";
    let values = [];

    if (peran === "dokter") {
      query = `
        SELECT jt.*, a.nama AS nama_anak, p.nama AS nama_orang_tua
        FROM janji_temu jt
        JOIN anak a ON jt.anak_id = a.id
        JOIN pengguna p ON a.orang_tua_id = p.id
        JOIN dokter d ON jt.dokter_id = d.id
        WHERE d.pengguna_id = $1
        ORDER BY jt.tanggal_janji ASC
      `;
      values = [id];
    }
    // TAMBAHKAN BLOK ELSE IF UNTUK ADMIN DI SINI
    else if (peran === "admin") {
      query = `
        SELECT jt.*, a.nama AS nama_anak, p_dok.nama AS nama_dokter, d.spesialisasi
        FROM janji_temu jt
        LEFT JOIN anak a ON jt.anak_id = a.id
        LEFT JOIN dokter d ON jt.dokter_id = d.id
        LEFT JOIN pengguna p_dok ON d.pengguna_id = p_dok.id
        ORDER BY jt.tanggal_janji DESC
      `;
      values = []; 
    }
    else {
      query = `
        SELECT jt.*, a.nama AS nama_anak, p_dok.nama AS nama_dokter, d.spesialisasi
        FROM janji_temu jt
        JOIN anak a ON jt.anak_id = a.id
        JOIN dokter d ON jt.dokter_id = d.id
        JOIN pengguna p_dok ON d.pengguna_id = p_dok.id
        WHERE a.orang_tua_id = $1
        ORDER BY jt.tanggal_janji ASC
      `;
      values = [id];
    }

    const result = await db.query(query, values);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. READ DETAIL: AMBIL DETAIL SATU JANJI TEMU
export const getDetailJanjiTemu = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: user_id, peran } = req.user;

    let query = "";
    let values = [];

    if (peran === "dokter") {
      query = `
        SELECT jt.*, a.nama AS nama_anak, p.nama AS nama_orang_tua
        FROM janji_temu jt
        JOIN anak a ON jt.anak_id = a.id
        JOIN pengguna p ON a.orang_tua_id = p.id
        JOIN dokter d ON jt.dokter_id = d.id
        WHERE jt.id = $1 AND d.pengguna_id = $2
      `;
      values = [id, user_id];
    } else {
      query = `
        SELECT jt.*, a.nama AS nama_anak, p_dok.nama AS nama_dokter, d.spesialisasi
        FROM janji_temu jt
        JOIN anak a ON jt.anak_id = a.id
        JOIN dokter d ON jt.dokter_id = d.id
        JOIN pengguna p_dok ON d.pengguna_id = p_dok.id
        WHERE jt.id = $1 AND a.orang_tua_id = $2
      `;
      values = [id, user_id];
    }

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Janji temu tidak ditemukan.",
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE STATUS: UBAH STATUS DAN CATATAN DOKTER
export const updateStatusJanji = async (req, res) => {
  try {
    const { id } = req.params;
    // Menambahkan 'catatan_dokter' untuk diupdate
    const { status, catatan_dokter } = req.body; 
    const { peran } = req.user;

    if (peran !== "dokter" && peran !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak.",
      });
    }

    // Update status DAN catatan_dokter sekaligus
    const result = await db.query(
      `
      UPDATE janji_temu 
      SET status = $1, catatan_dokter = $2 
      WHERE id = $3
      RETURNING *
      `,
      [status, catatan_dokter, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data janji temu tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: `Status berhasil diubah menjadi: ${status}`,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};