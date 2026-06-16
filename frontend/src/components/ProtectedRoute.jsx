import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Tampilkan loading state saat sistem sedang memvalidasi sesi (cek /api/auth/me)
  // Kamu bisa mengganti div ini dengan komponen Spinner atau LoadingScreen yang cantik
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Memuat data akun...
      </div>
    );
  }

  // 2. Jika user belum login, arahkan ke login.
  // Gunakan 'state={{ from: location }}' agar setelah login, user bisa diarahkan 
  // kembali ke halaman yang sebelumnya ingin ia tuju (bukan selalu ke dashboard).
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Cek apakah role user sesuai dengan yang dibutuhkan rute tersebut.
  // Jika requiredRole diberikan tapi peran user tidak cocok, tolak akses.
  if (requiredRole && user.peran !== requiredRole) {
    // Sebagai alternatif, kamu bisa arahkan ke halaman "Unauthorized"
    return <Navigate to="/" replace />; 
  }

  // 4. Jika user sudah login dan role sesuai, tampilkan konten halaman (dashboard/dll).
  return children;
};

export default ProtectedRoute;