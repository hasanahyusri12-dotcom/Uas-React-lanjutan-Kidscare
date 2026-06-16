import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Mengambil token langsung dari cookies yang dikirim otomatis oleh browser
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak, token tidak ditemukan",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Menyimpan data payload token (id & peran) ke objek req agar bisa diakses di rute selanjutnya
    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau telah kedaluwarsa",
    });
  }
};