import { db } from "../config/db.js";

export const tambahAnak = async (req, res) => {
  try {
    const { nama, tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan } = req.body;
    const orang_tua_id = req.user.id;

    // Tambahkan baris ini untuk validasi tanggal
    const tglLahirFinal = (tanggal_lahir === "" || !tanggal_lahir) ? null : tanggal_lahir;

    const result = await db.query(
      `
      INSERT INTO anak (orang_tua_id, nama, tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [orang_tua_id, nama, tglLahirFinal, jenis_kelamin, tinggi_badan, berat_badan]
    );

    res.status(201).json({
      success: true,
      message: "Data anak berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 2. READ: AMBIL ALL DATA ANAK (Milik Orang Tua yang Login)
export const getAnakSaya = async (req, res) => {
  try {
    const orang_tua_id = req.user.id;

    const result = await db.query(
      "SELECT * FROM anak WHERE orang_tua_id = $1 ORDER BY id DESC",
      [orang_tua_id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. READ: AMBIL DETAIL SATU ANAK
export const getDetailAnak = async (req, res) => {
  try {
    const { id } = req.params;
    const orang_tua_id = req.user.id;

    const result = await db.query(
      "SELECT * FROM anak WHERE id = $1 AND orang_tua_id = $2",
      [id, orang_tua_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data anak tidak ditemukan atau Anda tidak memiliki hak akses",
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE: EDIT DATA ANAK (BARU ✨)
export const updateAnak = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan } = req.body;
    const orang_tua_id = req.user.id;

    // Pastikan anak tersebut emang milik orang tua yang sedang login
    const cekAnak = await db.query("SELECT * FROM anak WHERE id = $1 AND orang_tua_id = $2", [id, orang_tua_id]);
    
    if (cekAnak.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data anak tidak ditemukan atau Anda tidak memiliki hak akses",
      });
    }

    // Jalankan query update
    const result = await db.query(
      `
      UPDATE anak 
      SET nama = $1, tanggal_lahir = $2, jenis_kelamin = $3, tinggi_badan = $4, berat_badan = $5
      WHERE id = $6 AND orang_tua_id = $7
      RETURNING *
      `,
      [nama, tanggal_lahir, jenis_kelamin, tinggi_badan, berat_badan, id, orang_tua_id]
    );

    res.json({
      success: true,
      message: "Data anak berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DELETE: HAPUS DATA ANAK (BARU ✨)
export const hapusAnak = async (req, res) => {
  try {
    const { id } = req.params;
    const orang_tua_id = req.user.id;

    const result = await db.query(
      "DELETE FROM anak WHERE id = $1 AND orang_tua_id = $2 RETURNING *",
      [id, orang_tua_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data anak tidak ditemukan atau Anda tidak memiliki hak akses",
      });
    }

    res.json({
      success: true,
      message: `Data anak atas nama "${result.rows[0].nama}" berhasil dihapus`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};