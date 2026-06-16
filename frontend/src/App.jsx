import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Import Halaman Dashboard - Menggunakan file tunggal yang sudah responsif
import Dashboard from "./pages/Dashboard";
import DashboardOrangTua from "./pages/DashboardOrangTua"; 
import DashboardDokter from "./pages/DashboardDokter";

// Import Komponen Keamanan
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rute Khusus Admin */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Rute Khusus Orang Tua */}
      <Route path="/dashboard-orang-tua" element={
        <ProtectedRoute requiredRole="orang_tua">
          <DashboardOrangTua />
        </ProtectedRoute>
      } />

      {/* Rute Khusus Dokter */}
      <Route path="/dashboard-dokter" element={
        <ProtectedRoute requiredRole="dokter">
          <DashboardDokter />
        </ProtectedRoute>
      } />

      {/* Redirect jika rute tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
