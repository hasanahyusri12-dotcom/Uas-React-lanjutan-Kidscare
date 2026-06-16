import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // TAMBAHKAN STATE ERROR DI SINI
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Reset error saat user mulai mengetik lagi
    setError("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = await login(formData.email, formData.password);
    const peran = data?.user?.peran;

    // Arahkan berdasarkan peran
    if (peran === "admin") {
      navigate("/dashboard", { replace: true });
    } else if (peran === "dokter") {
      navigate("/dashboard-dokter", { replace: true });
    } else if (peran === "orang_tua") {
      navigate("/dashboard-orang-tua", { replace: true });
    } else {
      navigate("/"); // Fallback jika peran tidak dikenal
    }
  } catch (err) {
    setError(err);
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8ffee] font-sans p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-[#1a7a4a]/10 border border-[#c0e2cb]">
        {/* Left Side - Visual Branding Icons */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-[#1a7a4a] relative overflow-hidden text-center text-white">
          <div className="relative z-10">
            <div className="w-48 h-48 mx-auto rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-8xl mb-8 shadow-2xl border-4 border-white/20">👤</div>
            <h2 className="font-serif text-3xl font-bold mb-4">
              Teman Setia
              <br />
              Kesehatan Buah Hati
            </h2>
            <p className="text-white/70 text-sm max-w-xs mx-auto leading-relaxed">Masuk untuk mengelola jadwal konsultasi dan rekam medis si kecil dengan mudah dan aman.</p>
            <div className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
              <span className="text-lg">✅</span> TERPERCAYA: 10k+ Orang Tua
            </div>
          </div>
          {/* Decorative Background Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#4eca80]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          {/* TOMBOL KEMBALI DI SINI - Kita kasih absolut supaya dia nempel di pojok kiri atas */}
          <Link to="/" className="absolute top-8 left-8 inline-flex items-center text-[#1a7a4a] font-bold text-sm hover:underline">
            <span className="mr-2">←</span> Kembali
          </Link>
          <div className="mb-10 text-center md:text-left">
            <Link to="/" className="inline-block md:hidden mb-6 no-underline">
              <span className="font-serif text-2xl font-bold text-[#1a7a4a]">KidsCare</span>
            </Link>
            <h1 className="font-serif text-4xl font-bold text-[#0f2d1e] mb-2">Selamat Datang Kembali</h1>
            <p className="text-[#4a6b5a] text-sm">Silakan masukkan detail akun Anda untuk melanjutkan akses.</p>
          </div>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-600 text-xs font-bold rounded-xl border border-red-200">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-[#0f2d1e] uppercase tracking-wider mb-2">Alamat Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="contoh@email.com"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#e8ffee]/30 border-2 border-[#c0e2cb] focus:border-[#1a7a4a] outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-[#0f2d1e] uppercase tracking-wider">Kata Sandi</label>
                <Link to="/forgot-password" text="Lupa Sandi?" className="text-[#1a7a4a] text-xs font-bold no-underline hover:underline">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" // <--- UBAH DARI "kata_sandi" MENJADI "password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#e8ffee]/30 border-2 border-[#c0e2cb] focus:border-[#1a7a4a] outline-none transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6b5a] hover:text-[#1a7a4a]">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} className="w-4 h-4 accent-[#1a7a4a]" />
              <label htmlFor="remember" className="text-xs text-[#4a6b5a] font-medium cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#1a7a4a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#1a7a4a]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70">
              {loading ? "⏳ Memproses..." : "Masuk ke Akun"}
            </button>
          </form>
          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c0e2cb]"></div>
            </div>
            <span className="relative bg-white px-4 text-[10px] font-bold text-[#4a6b5a] uppercase tracking-widest">Atau Masuk Dengan</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border-2 border-[#c0e2cb] py-3 rounded-2xl hover:bg-[#e8ffee]/50 transition-colors text-xs font-bold text-[#0f2d1e]">
              <span className="text-lg">G</span> Google
            </button>
            <button className="flex items-center justify-center gap-2 border-2 border-[#c0e2cb] py-3 rounded-2xl hover:bg-[#e8ffee]/50 transition-colors text-xs font-bold text-[#0f2d1e]">
              <span className="text-lg">F</span> Facebook
            </button>
          </div>
          <p className="mt-8 text-center text-sm text-[#4a6b5a]">
            Belum memiliki akun?{" "}
            <Link to="/register" className="text-[#1a7a4a] font-bold no-underline hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
