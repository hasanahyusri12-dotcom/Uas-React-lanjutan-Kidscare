import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

// ── ILUSTRASI HERO (SVG) ──────────────────────────────────────────
const HeroIllustration = () => (
  <svg width="100%" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="170" cy="170" r="155" fill="#d9fce4" />
    <circle cx="60" cy="80" r="28" fill="#b3f0cc" opacity="0.6" />
    <circle cx="290" cy="260" r="36" fill="#b3f0cc" opacity="0.5" />
    <circle cx="300" cy="70" r="18" fill="#4eca80" opacity="0.3" />
    <rect x="115" y="160" width="110" height="120" rx="20" fill="#1a7a4a" />
    <rect x="130" y="160" width="80" height="120" rx="14" fill="#fff" />
    <rect x="152" y="160" width="36" height="90" rx="4" fill="#e8ffee" />
    <path d="M148 185 Q140 200 148 215 Q158 228 170 220 Q182 228 192 215 Q200 200 192 185" stroke="#1a7a4a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="170" cy="222" r="8" fill="#1a7a4a" />
    <circle cx="170" cy="130" r="42" fill="#f5c5a3" />
    <path d="M128 120 Q130 85 170 80 Q210 85 212 120 Q200 100 170 98 Q140 100 128 120Z" fill="#3d2314" />
    <circle cx="158" cy="128" r="4" fill="#3d2314" />
    <circle cx="182" cy="128" r="4" fill="#3d2314" />
    <circle cx="159" cy="127" r="1.5" fill="#fff" />
    <circle cx="183" cy="127" r="1.5" fill="#fff" />
    <path d="M160 140 Q170 148 180 140" stroke="#c0785a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="150" cy="138" r="7" fill="#f4a0a0" opacity="0.5" />
    <circle cx="190" cy="138" r="7" fill="#f4a0a0" opacity="0.5" />
    <circle cx="118" cy="210" r="28" fill="#fce4b3" />
    <path d="M90 205 Q92 180 118 178 Q144 180 146 205 Q136 190 118 190 Q100 190 90 205Z" fill="#c8860a" />
    <circle cx="110" cy="210" r="3" fill="#3d2314" />
    <circle cx="126" cy="210" r="3" fill="#3d2314" />
    <path d="M112 220 Q118 226 124 220" stroke="#c0785a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="96" y="236" width="44" height="50" rx="14" fill="#4eca80" />
    <text x="118" y="265" textAnchor="middle" fontSize="14" fill="#fff">⭐</text>
    <rect x="210" y="195" width="60" height="75" rx="10" fill="#fff" stroke="#c0e2cb" strokeWidth="1.5" />
    <rect x="220" y="187" width="40" height="12" rx="6" fill="#c0e2cb" />
    <line x1="220" y1="215" x2="260" y2="215" stroke="#e0f0e8" strokeWidth="2" />
    <line x1="220" y1="228" x2="255" y2="228" stroke="#e0f0e8" strokeWidth="2" />
    <line x1="220" y1="241" x2="250" y2="241" stroke="#e0f0e8" strokeWidth="2" />
    <rect x="220" y="252" width="30" height="8" rx="4" fill="#4eca80" />
    <circle cx="285" cy="120" r="22" fill="#fff" stroke="#c0e2cb" strokeWidth="1.5" />
    <rect x="282" y="110" width="6" height="20" rx="3" fill="#1a7a4a" />
    <rect x="275" y="117" width="20" height="6" rx="3" fill="#1a7a4a" />
    <path d="M52 155 C52 150 57 145 63 150 C69 145 74 150 74 155 C74 162 63 170 63 170 C63 170 52 162 52 155Z" fill="#ff7f9e" />
    <circle cx="95" cy="290" r="5" fill="#4eca80" opacity="0.6" />
    <circle cx="110" cy="300" r="3" fill="#4eca80" opacity="0.4" />
    <circle cx="250" cy="55" r="6" fill="#1a7a4a" opacity="0.3" />
    <circle cx="265" cy="45" r="3" fill="#1a7a4a" opacity="0.2" />
  </svg>
);

// ── ILUSTRASI WHY (SVG) ───────────────────────────────────────────
const FamilyIllustration = () => (
  <svg width="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="150" cy="150" r="130" fill="#c0e2cb" opacity="0.4" />
    <circle cx="110" cy="110" r="30" fill="#f5c5a3" />
    <path d="M80 105 Q82 80 110 78 Q138 80 140 105 Q130 92 110 92 Q90 92 80 105Z" fill="#3d2314" />
    <circle cx="102" cy="112" r="3" fill="#3d2314" />
    <circle cx="118" cy="112" r="3" fill="#3d2314" />
    <path d="M104 122 Q110 128 116 122" stroke="#c0785a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="88" y="138" width="44" height="55" rx="14" fill="#1a7a4a" />
    <circle cx="190" cy="110" r="30" fill="#f5c5a3" />
    <path d="M163 100 Q170 75 190 78 Q210 75 218 100 Q210 88 190 88 Q170 88 163 100Z" fill="#8B4513" />
    <circle cx="182" cy="112" r="3" fill="#3d2314" />
    <circle cx="198" cy="112" r="3" fill="#3d2314" />
    <path d="M184 122 Q190 128 196 122" stroke="#c0785a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="168" y="138" width="44" height="55" rx="14" fill="#4eca80" />
    <circle cx="150" cy="200" r="24" fill="#fce4b3" />
    <path d="M127 196 Q130 178 150 176 Q170 178 173 196 Q164 186 150 186 Q136 186 127 196Z" fill="#c8860a" />
    <circle cx="143" cy="202" r="3" fill="#3d2314" />
    <circle cx="157" cy="202" r="3" fill="#3d2314" />
    <path d="M144 212 Q150 218 156 212" stroke="#c0785a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="130" y="222" width="40" height="42" rx="12" fill="#ff9f43" />
    <path d="M145 158 C145 154 149 150 153 154 C157 150 161 154 161 158 C161 163 153 169 153 169 C153 169 145 163 145 158Z" fill="#ff7f9e" />
    <text x="58" y="200" fontSize="20" fill="#4eca80" opacity="0.7">⭐</text>
    <text x="228" y="170" fontSize="16" fill="#4eca80" opacity="0.6">💚</text>
    <text x="85" y="260" fontSize="14" fill="#1a7a4a" opacity="0.5">✨</text>
  </svg>
);

// ── HERO ──────────────────────────────────────────────────────────
const Hero = () => (
  <section id="beranda" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#e8ffee]">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
      <div className="animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-[#d9fce4] border border-[#1a7a4a]/20 px-4 py-1.5 rounded-full mb-6">
          <span className="text-sm">🌱</span>
          <span className="text-xs font-bold text-[#1a7a4a] uppercase tracking-wider">Klinik Anak Terpercaya di Bandung</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#0f2d1e] leading-tight mb-6">
          Menjaga Tumbuh Kembang{" "}
          <span className="text-[#1a7a4a] italic relative">
            Si Kecil
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
              <path d="M0,6 Q50,0 100,5 Q150,10 200,4" stroke="#4eca80" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>{" "}
          Secara Profesional
        </h1>
        <p className="text-lg text-[#4a6b5a] mb-8 max-w-lg leading-relaxed">
          KidsCare menghadirkan pelayanan kesehatan anak terbaik di Bandung dengan sentuhan kasih sayang dan teknologi modern. Janji temu kini lebih mudah dan terukur.
        </p>
        <div className="flex flex-wrap gap-4 mb-10">
          <Link to="/login" className="bg-[#1a7a4a] text-white font-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-all shadow-md shadow-[#1a7a4a]/25 text-center">
            📅 Buat Janji Online
          </Link>
          <a href="#layanan" className="bg-white border-2 border-[#c0e2cb] text-[#1a7a4a] font-bold px-8 py-4 rounded-2xl hover:border-[#1a7a4a] transition-colors text-center">
            Lihat Layanan Kami
          </a>
        </div>
        <div className="flex gap-8 pt-6 border-t border-[#c0e2cb]">
          {[
            { num: "500+", label: "Pasien Terlayani" },
            { num: "12+",  label: "Dokter Spesialis" },
            { num: "4.9★", label: "Rating Kepuasan"  },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-serif text-2xl font-bold text-[#1a7a4a]">{s.num}</div>
              <div className="text-xs text-[#4a6b5a] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative animate-fade-in flex justify-center">
        <div className="relative w-full max-w-md">
          <HeroIllustration />
          <div className="absolute top-4 right-0 bg-white border border-[#e0f0e8] px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-[#1a7a4a] flex items-center gap-2">
            ✅ Dokter Terverifikasi
          </div>
          <div className="absolute bottom-8 left-0 bg-white border border-[#e0f0e8] px-4 py-2 rounded-2xl shadow-lg text-xs font-bold text-[#0f2d1e] flex items-center gap-2">
            🔔 Janji temu dikonfirmasi!
          </div>
        </div>
      </div>
    </div>
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4eca80]/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#1a7a4a]/5 rounded-full blur-3xl pointer-events-none" />
  </section>
);

// ── SERVICES ──────────────────────────────────────────────────────
const ServiceCard = ({ icon, title, description, isPrimary }) => (
  <div className={`p-8 rounded-3xl transition-all group ${isPrimary ? "bg-[#1a7a4a] text-white shadow-xl shadow-[#1a7a4a]/20" : "bg-white border border-[#c0e2cb] hover:shadow-xl hover:-translate-y-2"}`}>
    <div className="text-4xl mb-6 transition-transform group-hover:scale-110">{icon}</div>
    <h3 className={`font-serif text-xl font-bold mb-3 ${isPrimary ? "text-white" : "text-[#0f2d1e]"}`}>{title}</h3>
    <p className={`leading-relaxed text-sm ${isPrimary ? "text-white/80" : "text-[#4a6b5a]"}`}>{description}</p>
  </div>
);

const Services = () => (
  <section id="layanan" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <span className="text-[#1a7a4a] font-bold uppercase tracking-widest text-xs mb-2 block">Layanan Kami</span>
      <h2 className="font-serif text-4xl font-bold text-[#0f2d1e] leading-tight">
        Solusi Kesehatan Komprehensif<br />Untuk Buah Hati Anda
      </h2>
    </div>
    <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { icon: "🩺", title: "Poli Umum Anak",    description: "Pemeriksaan kesehatan menyeluruh untuk bayi dan anak usia sekolah.", isPrimary: true },
        { icon: "💉", title: "Imunisasi Lengkap",  description: "Program vaksinasi terjadwal sesuai standar Ikatan Dokter Anak Indonesia." },
        { icon: "📈", title: "Tumbuh Kembang",     description: "Pemantauan aspek motorik, sensorik, dan kognitif si kecil secara berkala." },
        { icon: "🥗", title: "Konsultasi Gizi",    description: "Panduan nutrisi tepat untuk mengatasi GTM dan menjaga berat badan ideal." },
      ].map((s, i) => <ServiceCard key={i} {...s} />)}
    </div>
  </section>
);

// ── WHY KIDSCARE ──────────────────────────────────────────────────
const WhyKidsCare = () => (
  <section className="py-24 bg-[#e8ffee]">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <FamilyIllustration />
        </div>
      </div>
      <div>
        <span className="text-[#1a7a4a] font-bold uppercase tracking-widest text-xs mb-2 block">Kenapa KidsCare?</span>
        <h2 className="font-serif text-4xl font-bold text-[#0f2d1e] mb-10">
          Dipercaya Ribuan<br />Keluarga di Bandung
        </h2>
        <div className="flex flex-col gap-6">
          {[
            { icon: "📱", title: "Janji Temu Online 24/7",           desc: "Buat jadwal konsultasi kapan saja dan di mana saja tanpa perlu antri panjang." },
            { icon: "📋", title: "Rekam Medis Digital",               desc: "Seluruh riwayat kesehatan anak tersimpan aman dan mudah diakses kapan pun." },
            { icon: "👨‍⚕️", title: "Dokter Spesialis Berpengalaman", desc: "Tim dokter anak terlatih dan bersertifikat siap menangani si kecil dengan penuh kasih." },
            { icon: "💬", title: "Notifikasi & Pengingat Otomatis",   desc: "Tidak akan melewatkan jadwal imunisasi dan kontrol tumbuh kembang si kecil." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-2xl bg-[#d9fce4] flex items-center justify-center text-xl flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#0f2d1e] text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-[#4a6b5a] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── DOCTORS ───────────────────────────────────────────────────────
const DoctorCard = ({ name, role, badge }) => (
  <div className="group bg-white p-8 rounded-[32px] border border-[#c0e2cb] transition-all hover:shadow-2xl hover:-translate-y-2 text-center">
    <div className="w-24 h-24 rounded-full bg-[#d9fce4] flex items-center justify-center text-4xl mb-6 mx-auto border-4 border-[#e8ffee] shadow-inner">
      👨‍⚕️
    </div>
    <span className="bg-[#d9fce4] px-3 py-1 rounded-full text-[10px] font-bold text-[#1a7a4a] mb-3 inline-block uppercase tracking-wider">{badge}</span>
    <h3 className="font-serif text-lg font-bold text-[#0f2d1e]">{name}</h3>
    <p className="text-xs text-[#4a6b5a] mt-2 leading-relaxed">{role}</p>
  </div>
);

const Doctors = () => (
  <section id="dokter" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 text-center mb-16">
      <span className="text-[#1a7a4a] font-bold text-xs tracking-widest uppercase mb-2 block">Tenaga Ahli</span>
      <h2 className="font-serif text-4xl font-bold text-[#0f2d1e]">Bertemu Dokter Spesialis Terbaik</h2>
      <p className="text-[#4a6b5a] mt-4 max-w-xl mx-auto text-sm">
        Dokter kami memiliki dedikasi tinggi dan pengalaman bertahun-tahun dalam menangani pasien anak.
      </p>
    </div>
    <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { name: "dr. Siti Rahayu, Sp.A",  role: "Konsultan Tumbuh Kembang dengan pengalaman 12 tahun.", badge: "Tumbuh Kembang" },
        { name: "dr. Budi Santoso, Sp.A", role: "Spesialis Nutrisi Anak, fokus pada pola makan sehat.",  badge: "Spesialis Gizi"  },
        { name: "dr. Liana Putri, Sp.A",  role: "Pediatrik Umum dengan pendekatan ramah anak.",           badge: "Pediatrik Umum" },
      ].map((d, i) => <DoctorCard key={i} {...d} />)}
    </div>
  </section>
);

// ── TESTIMONIALS ──────────────────────────────────────────────────
const TestimonialCard = ({ name, role, text, stars }) => (
  <div className="p-8 rounded-3xl bg-white shadow-sm border border-[#c0e2cb] transition-all hover:shadow-lg">
    <div className="flex gap-1 mb-4 text-orange-400 text-xs">
      {[...Array(stars)].map((_, i) => <span key={i}>★</span>)}
    </div>
    <p className="text-[#4a6b5a] mb-6 leading-relaxed italic text-sm">"{text}"</p>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#4eca80]/20 flex items-center justify-center text-[#1a7a4a] font-bold text-xs uppercase">
        {name.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-[#0f2d1e] text-sm">{name}</h4>
        <p className="text-[10px] text-[#4a6b5a] uppercase tracking-wider font-medium">{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => (
  <section id="testimoni" className="py-24 bg-[#e8ffee]">
    <div className="max-w-7xl mx-auto px-6 text-center mb-16">
      <span className="text-[#1a7a4a] font-bold text-xs tracking-widest uppercase mb-2 block">Testimoni</span>
      <h2 className="font-serif text-4xl font-bold text-[#0f2d1e]">Kata Orang Tua Kami</h2>
    </div>
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
      <TestimonialCard name="Ibu Raisa"  role="Orang tua Aluna" text="Sangat puas dengan pelayanan KidsCare. Dokternya sangat sabar dan detail menjelaskan kondisi anak saya." stars={5} />
      <TestimonialCard name="Ibu Dewi"   role="Orang tua Baim"  text="Sistem antrean online-nya juara! Datang langsung masuk tanpa nunggu lama, anak jadi tidak rewel." stars={5} />
      <TestimonialCard name="Bapak Aldi" role="Orang tua Kenzo" text="Kliniknya sangat nyaman dan kids-friendly. Banyak area bermain yang membuat anak merasa tenang." stars={5} />
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────────────
const CTA = () => (
  <section className="py-16 px-6 bg-white">
    <div className="max-w-7xl mx-auto bg-[#1a7a4a] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#1a7a4a]/30">
      <div className="relative z-10">
        <div className="text-5xl mb-6">💚</div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
          Mari Jaga Senyum Sehat<br />Buah Hati Bersama KidsCare
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Pendaftaran pasien baru dan konsultasi online dapat dilakukan dalam hitungan menit.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="bg-white text-[#1a7a4a] font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-transform shadow-lg text-center">
            Daftar Pasien Baru
          </Link>
          <a href="#kontak" className="bg-transparent border-2 border-white/30 text-white font-bold px-10 py-4 rounded-2xl hover:bg-white/10 transition-colors text-center">
            Hubungi Admin
          </a>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#4eca80]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
    </div>
  </section>
);

// ── MAIN PAGE ─────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="bg-[#e8ffee] font-sans text-[#0f2d1e] selection:bg-[#4eca80]/30 overflow-x-hidden">
    <Navbar />
    <Hero />
    <Services />
    <WhyKidsCare />
    <Doctors />
    <Testimonials />
    <CTA />
    <Footer />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
      .font-serif { font-family: 'Playfair Display', serif; }
      .font-sans  { font-family: 'DM Sans', sans-serif; }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
      .animate-fade-in    { animation: fade-in 1.2s ease-out forwards; }
    `}</style>
  </div>
);

export default LandingPage;