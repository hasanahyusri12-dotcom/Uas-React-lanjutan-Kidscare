import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Kata sandi tidak cocok!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          no_hp: formData.no_hp || null,
          kata_sandi: formData.password,
          peran: "orang_tua",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      } else {
        alert(data.message || "Gagal mendaftar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan, pastikan server backend menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8ffee] font-sans p-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-[#1a7a4a]/10 border border-[#c0e2cb]">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-[#1a7a4a] text-white relative">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 no-underline mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">🌿</div>
              <span className="font-serif text-2xl font-bold text-white">KidsCare</span>
            </Link>
            <h2 className="font-serif text-4xl font-bold leading-tight mb-6">
              Bergabunglah dengan ribuan keluarga
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Mulai perjalanan kesehatan anak Anda dengan akses ke tenaga medis terbaik dan sistem pemantauan yang modern.
            </p>
          </div>
          <div className="relative z-10 bg-white/10 backdrop-blur-xl p-10 rounded-[32px] border border-white/10 mt-8 text-center">
            <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center text-6xl mb-6 shadow-inner">➕</div>
            <p className="text-sm font-medium text-white/90">Aman & Terpercaya</p>
            <p className="text-xs text-white/60 mt-2">Data medis terenkripsi dengan standar keamanan tinggi.</p>
          </div>
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#4eca80]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="animate-fade-in-up">
            <h2 className="font-serif text-3xl font-bold text-[#0f2d1e] mb-2">Daftar Akun</h2>
            <p className="text-[#4a6b5a] text-sm mb-8">Buat akun untuk mulai memantau kesehatan anak Anda.</p>

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <InputField
                label="Nama Lengkap"
                name="nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
              />

              <InputField
                label="Alamat Email"
                name="email"
                type="email"
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="new-email"
              />

              {/* No HP — opsional */}
              <InputField
                label="Nomor HP (opsional)"
                name="no_hp"
                type="tel"
                placeholder="cth: 08123456789"
                value={formData.no_hp}
                onChange={handleChange}
                required={false}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Kata Sandi"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <InputField
                  label="Konfirmasi"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a7a4a] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity"
              >
                {loading ? "⏳ Mendaftarkan..." : "Daftar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#4a6b5a]">
              Sudah memiliki akun?{" "}
              <Link to="/login" className="text-[#1a7a4a] font-bold no-underline hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type, placeholder, value, onChange, autoComplete = "off", required = true }) => (
  <div>
    <label className="block text-[10px] font-bold text-[#0f2d1e] uppercase tracking-widest mb-1.5 ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full px-5 py-3.5 rounded-2xl bg-[#e8ffee]/30 border-2 border-[#c0e2cb] focus:border-[#1a7a4a] outline-none transition-colors text-sm"
    />
  </div>
);

export default RegisterPage;