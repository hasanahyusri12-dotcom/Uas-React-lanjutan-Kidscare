import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const apiFetch = async (url, opt = {}) => {
  const fullUrl = url.startsWith("/api") ? url : `/api${url}`;
  try {
    const r = await fetch(API + fullUrl, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...opt,
    });
    if (!r.ok) {
      console.error(`Gagal memuat ${fullUrl}, status: ${r.status}`);
      return { success: false, data: [] };
    }
    return await r.json();
  } catch (err) {
    console.error("apiFetch error:", url, err);
    return { success: false, data: [] };
  }
};

// ── HIJAU SOLID BOLD PALETTE (seperti gambar referensi) ─────────────────────
const M = {
  900: "#2c4a3e", // sage teks gelap
  800: "#3d6b5a", // sidebar bg — sage medium, tidak norak
  700: "#4a806a", // sidebar hover
  600: "#5a9478", // aksen medium
  500: "#6aaa8a", // border / divider
  400: "#8ec4a8", // icon soft
  200: "#c5e0d4", // border muda
  100: "#e4f2ec", // bg surface lembut
  50: "#f4faf7", // bg halaman utama
  amber: "#e8a020",
  amberLight: "#fdf6e8",
  amberDark: "#7a5010",
  cream: "#ffffff",
  red: "#d94f4f",
  redLight: "#fdf0f0",
  blue: "#3a7bc8",
  blueLight: "#eaf2fc",
  purple: "#6d4fc2",
  purpleLight: "#f0ebff",
};

const MENU = [
  { id: "overview", icon: "🏠", label: "Overview" },
  { id: "dokter", icon: "🩺", label: "Dokter" },
  { id: "janji", icon: "📅", label: "Janji Temu" },
  { id: "rekam", icon: "📋", label: "Rekam Medis" },
];

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebar, setSidebar] = useState(true);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.peran !== "admin")) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (loading || !user) return <Loader />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f7faf8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.45} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:${M[200]};border-radius:3px}
        input:focus,select:focus,textarea:focus{outline:none;border-color:${M[500]}!important;box-shadow:0 0 0 3px ${M[100]}!important}
        .nav-btn:hover{background:rgba(255,255,255,0.08)!important;color:#fff!important}
        .card-hover:hover{transform:translateY(-4px)!important;box-shadow:0 14px 32px rgba(26,46,20,0.13)!important}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: sidebar ? 252 : 68,
          flexShrink: 0,
          background: `linear-gradient(180deg, ${M[900]} 0%, ${M[800]} 100%)`,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.32s cubic-bezier(.16,1,.3,1)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflow: "hidden",
          zIndex: 50,
          boxShadow: `4px 0 28px rgba(26,46,20,0.28)`,
        }}
      >
        {/* Dot texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`, backgroundSize: "20px 20px", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 11, borderBottom: `1px solid rgba(200,221,184,0.15)`, position: "relative" }}>
          <div
            style={{ width: 40, height: 40, borderRadius: 13, background: `rgba(255,255,255,0.1)`, border: `1px solid rgba(255,255,255,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}
          >
            🍵
          </div>
          {sidebar && (
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18, color: "#fff", lineHeight: 1 }}>KidsCare</div>
              <div style={{ fontSize: 10, color: `rgba(200,221,184,0.6)`, marginTop: 2, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Admin chip */}
        {sidebar && (
          <div
            style={{ margin: "14px 12px 0", padding: "11px 13px", background: `rgba(255,255,255,0.07)`, borderRadius: 14, border: `1px solid rgba(255,255,255,0.12)`, display: "flex", alignItems: "center", gap: 10, position: "relative" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${M[500]}, ${M[400]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                flexShrink: 0,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {user.nama?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.nama}</div>
              <div style={{ fontSize: 11, color: M[400], fontWeight: 600 }}>⚙️ Administrator</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 8px", position: "relative" }}>
          {MENU.map((m) => (
            <button
              key={m.id}
              className="nav-btn"
              onClick={() => setActiveTab(m.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 13,
                border: "none",
                cursor: "pointer",
                background: activeTab === m.id ? `rgba(255,255,255,0.12)` : "transparent",
                color: activeTab === m.id ? "#ffffff" : "rgba(255,255,255,0.55)",
                marginBottom: 3,
                transition: "all 0.2s",
                textAlign: "left",
                borderLeft: activeTab === m.id ? `3px solid ${M[400]}` : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{m.icon}</span>
              {sidebar && <span style={{ fontSize: 13, fontWeight: activeTab === m.id ? 700 : 500, whiteSpace: "nowrap" }}>{m.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "10px 8px 22px", position: "relative" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 12px",
              borderRadius: 13,
              border: `1px solid rgba(212,162,78,0.25)`,
              cursor: "pointer",
              background: `rgba(212,162,78,0.1)`,
              color: M.amber,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(212,162,78,0.22)`;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `rgba(212,162,78,0.1)`;
              e.currentTarget.style.color = M.amber;
            }}
          >
            <span style={{ fontSize: 17, flexShrink: 0 }}>🚪</span>
            {sidebar && <span style={{ fontSize: 13, fontWeight: 600 }}>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: sidebar ? 252 : 68, flex: 1, overflow: "auto", transition: "margin-left 0.32s cubic-bezier(.16,1,.3,1)" }}>
        {/* Topbar */}
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(12px)",
            padding: "13px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${M[100]}`,
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: `0 2px 16px rgba(26,46,20,0.06)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setSidebar(!sidebar)}
              style={{
                background: M[100],
                border: `1px solid ${M[200]}`,
                borderRadius: 11,
                width: 36,
                height: 36,
                cursor: "pointer",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: M[700],
                fontWeight: 700,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = M[800];
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = M[100];
                e.currentTarget.style.color = M[700];
              }}
            >
              {sidebar ? "◀" : "▶"}
            </button>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: M[900] }}>
                {MENU.find((m) => m.id === activeTab)?.icon} {MENU.find((m) => m.id === activeTab)?.label}
              </h1>
              <p style={{ margin: 0, fontSize: 11, color: M[600] }}>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: M[900] }}>{user.nama}</div>
              <div style={{ fontSize: 11, color: M[600], fontWeight: 600 }}>Administrator</div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${M[700]}, ${M[500]})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#fff",
                fontWeight: 800,
                boxShadow: `0 4px 12px rgba(61,97,48,0.3)`,
              }}
            >
              {user.nama?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "26px", animation: "fadeUp 0.45s ease both" }}>
          {activeTab === "overview" && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === "dokter" && <DokterTab />}
          {activeTab === "janji" && <JanjiTab />}
          {activeTab === "rekam" && <RekamTab />}
        </div>
      </main>
    </div>
  );
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────
function OverviewTab({ setActiveTab }) {
  const [data, setData] = useState({ dokter: [], janji: [], rekam: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [d, j, r] = await Promise.all([apiFetch("/dokter"), apiFetch("/janji-temu"), apiFetch("/rekam-medis")]);
        setData({ dokter: d.data || [], janji: j.data || [], rekam: r.data || [] });
      } catch (err) {
        console.error("Overview load error:", err);
        setError("Gagal memuat data. Pastikan backend berjalan.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <p style={{ fontSize: 15, color: M.red, fontWeight: 600 }}>{error}</p>
      </div>
    );

  const totalDokter = data.dokter.length;
  const totalJanji = data.janji.length;
  const menunggu = data.janji.filter((j) => j.status === "Menunggu").length;
  const totalRekam = data.rekam.length;

  const stats = [
    { label: "Total Dokter", value: totalDokter, trend: "Terdaftar", icon: "🩺", bg: M[700], text: "#fff", action: "dokter" },
    { label: "Total Janji Temu", value: totalJanji, trend: "Semua Status", icon: "📅", bg: M.blue, text: "#fff", action: "janji" },
    { label: "Menunggu Konfirmasi", value: menunggu, trend: "Belum Diproses", icon: "⏳", bg: M.amber, text: M[900], action: "janji" },
    { label: "Rekam Medis", value: totalRekam, trend: "Tersimpan", icon: "📋", bg: M.purple, text: "#fff", action: "rekam" },
  ];

  const janjiTerbaru = [...data.janji].sort((a, b) => new Date(b.tanggal_janji) - new Date(a.tanggal_janji)).slice(0, 5);

  const statusCount = { Menunggu: 0, Disetujui: 0, Selesai: 0, Dibatalkan: 0 };
  data.janji.forEach((j) => {
    if (statusCount[j.status] !== undefined) statusCount[j.status]++;
  });

  return (
    <div>
      {/* Greeting Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${M[800]} 0%, ${M[700]} 60%, ${M[600]} 100%)`,
          borderRadius: 22,
          padding: "26px 34px",
          marginBottom: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 12px 40px rgba(26,46,20,0.22)`,
        }}
      >
        <div style={{ position: "absolute", right: -30, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", left: "42%", bottom: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(143,184,122,0.08)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(143,184,122,0.18)", padding: "4px 13px", borderRadius: 100, marginBottom: 12, border: `1px solid rgba(143,184,122,0.32)` }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4dc880", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: M[400], fontWeight: 700 }}>Sistem Berjalan Normal</span>
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,2.8vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 7px", lineHeight: 1.25 }}>
            Selamat Datang di
            <br />
            Panel Admin KidsCare 🍵
          </h2>
          <p style={{ fontSize: 13, color: "rgba(228,240,216,0.7)", margin: 0 }}>Kelola seluruh data sistem dari satu tempat</p>
        </div>
        <div style={{ flexShrink: 0, fontSize: 88, opacity: 0.1, position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)" }}>🏥</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(195px,1fr))", gap: 14, marginBottom: 26 }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            onClick={() => setActiveTab(s.action)}
            style={{
              background: s.bg,
              borderRadius: 18,
              padding: "20px 20px",
              cursor: "pointer",
              transition: "all 0.28s",
              animation: `fadeUp 0.45s ease ${i * 0.07}s both`,
              boxShadow: `0 6px 22px rgba(26,46,20,0.14)`,
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 18px 40px rgba(13,51,32,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = `0 6px 22px rgba(26,46,20,0.14)`;
            }}
          >
            <div style={{ position: "absolute", right: -12, top: -12, width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.09)" }} />
            <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: s.text, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: s.text === "#fff" ? "rgba(255,255,255,0.85)" : `${M[800]}cc`, marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.text === "#fff" ? "rgba(255,255,255,0.5)" : `${M[700]}99`, marginTop: 2 }}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 18 }}>
        {/* Janji terbaru */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "22px 26px", border: `1px solid ${M[100]}`, boxShadow: `0 4px 16px rgba(26,46,20,0.05)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: M[900], margin: 0 }}>Janji Temu Terbaru</h3>
            <button onClick={() => setActiveTab("janji")} style={{ fontSize: 12, color: M[600], fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
              Lihat Semua →
            </button>
          </div>
          {janjiTerbaru.length === 0 ? (
            <Empty icon="📅" text="Belum ada janji temu." small />
          ) : (
            janjiTerbaru.map((j, i) => (
              <div key={j.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < janjiTerbaru.length - 1 ? `1px solid ${M[50]}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${M[100]}, ${M[200]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>👶</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: M[900] }}>{j.nama_anak}</div>
                    <div style={{ fontSize: 11, color: M[600] }}>
                      dr. {j.nama_dokter} · {j.spesialisasi}
                    </div>
                    <div style={{ fontSize: 10, color: M[400], marginTop: 1 }}>
                      {new Date(j.tanggal_janji).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · {new Date(j.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <StatusBadge status={j.status} />
              </div>
            ))
          )}
        </div>

        {/* Status distribusi */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", border: `1px solid ${M[100]}`, boxShadow: `0 4px 16px rgba(26,46,20,0.05)` }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: M[900], margin: "0 0 15px" }}>Status Janji Temu</h4>
          {Object.entries(statusCount).map(([status, count]) => {
            const pct = totalJanji > 0 ? Math.round((count / totalJanji) * 100) : 0;
            const colors = { Menunggu: M.amber, Disetujui: M[500], Selesai: M.blue, Dibatalkan: M.red };
            return (
              <div key={status} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: M[900] }}>{status}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors[status] }}>{count}</span>
                </div>
                <div style={{ height: 7, background: M[50], borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: colors[status], borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── DOKTER TAB ────────────────────────────────────────────────────────────────
function DokterTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);

  // fungsi load
  const load = async () => {
    setLoading(true);

    try {
      const d = await apiFetch("/dokter");
      setList(d.data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await load();
    };

    fetchData();
  }, []);

  const handleHapus = async (id, nama) => {
    if (!confirm(`Hapus dokter "${nama}"? Semua data terkait akan ikut terhapus.`)) return;
    const res = await apiFetch(`/dokter/${id}`, { method: "DELETE" });
    if (res.success) load();
    else alert(res.message || "Gagal menghapus dokter.");
  };

  const filtered = list.filter((d) => d.nama?.toLowerCase().includes(search.toLowerCase()) || d.spesialisasi?.toLowerCase().includes(search.toLowerCase()) || d.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 700, color: M[900], margin: 0 }}>Manajemen Dokter</h2>
          <p style={{ fontSize: 12, color: M[600], margin: "4px 0 0" }}>{list.length} dokter terdaftar</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: M[500] }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, spesialisasi..."
              style={{ padding: "9px 13px 9px 32px", border: `2px solid ${M[100]}`, borderRadius: 11, fontSize: 13, color: M[900], background: "#fff", width: 230, fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <button onClick={() => setModal(true)} style={btnPrimary}>
            ➕ Tambah Dokter
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <Empty icon="🩺" text="Tidak ada dokter yang ditemukan." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14 }}>
          {filtered.map((d, i) => (
            <div
              key={d.dokter_id}
              className="card-hover"
              style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", border: `1px solid ${M[100]}`, boxShadow: `0 2px 10px rgba(26,46,20,0.05)`, transition: "all 0.24s", animation: `fadeUp 0.45s ease ${i * 0.06}s both` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13 }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${M[100]}, ${M[200]})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                    border: `2px solid ${M[200]}`,
                  }}
                >
                  👨‍⚕️
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: M[900], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.nama}</div>
                  <div style={{ fontSize: 11, color: M[600], fontWeight: 600, marginTop: 2 }}>{d.spesialisasi}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: M[500], marginBottom: 8 }}>📧 {d.email}</div>
              {d.jadwal_praktik && <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: M[50], padding: "4px 11px", borderRadius: 100, fontSize: 11, color: M[700], marginBottom: 13 }}>🗓️ {d.jadwal_praktik}</div>}
              {!d.jadwal_praktik && <div style={{ marginBottom: 13 }} />}
              <button
                onClick={() => handleHapus(d.dokter_id, d.nama)}
                style={{ width: "100%", padding: "9px", borderRadius: 10, background: M.redLight, border: `1px solid #f5c6c0`, color: M.red, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = M.red;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = M.redLight;
                  e.currentTarget.style.color = M.red;
                }}
              >
                🗑️ Hapus Dokter
              </button>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <TambahDokterModal
          onClose={() => setModal(false)}
          onSuccess={() => {
            setModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

// ── MODAL TAMBAH DOKTER ───────────────────────────────────────────────────────
function TambahDokterModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ nama: "", email: "", kata_sandi: "", spesialisasi: "", jadwal_praktik: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const SPESIALISASI = ["Pediatri Umum", "Tumbuh Kembang Anak", "Neonatologi", "Konselor Laktasi", "Gizi Anak", "Neurologi Anak"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ ...form, peran: "dokter" }) });
    setLoading(false);
    if (res.success) onSuccess();
    else setError(res.message || "Gagal mendaftarkan dokter.");
  };

  return (
    <Modal title="➕ Tambah Dokter Baru" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Field label="Nama Lengkap" icon="👤">
          <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required placeholder="dr. Nama Dokter" style={inputStyle} />
        </Field>
        <Field label="Email" icon="📧">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="email@dokter.com" style={inputStyle} />
        </Field>
        <Field label="Kata Sandi" icon="🔒">
          <input type="password" value={form.kata_sandi} onChange={(e) => setForm({ ...form, kata_sandi: e.target.value })} required placeholder="Minimal 6 karakter" style={inputStyle} />
        </Field>
        <Field label="Spesialisasi" icon="🩺">
          <select value={form.spesialisasi} onChange={(e) => setForm({ ...form, spesialisasi: e.target.value })} required style={inputStyle}>
            <option value="">-- Pilih Spesialisasi --</option>
            {SPESIALISASI.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Jadwal Praktik" icon="🗓️">
          <input value={form.jadwal_praktik} onChange={(e) => setForm({ ...form, jadwal_praktik: e.target.value })} placeholder="Senin–Jumat, 08.00–16.00" style={inputStyle} />
        </Field>
        {error && <div style={{ background: M.redLight, border: `1px solid #f5c6c0`, borderRadius: 10, padding: "9px 13px", marginBottom: 13, fontSize: 13, color: M.red }}>⚠️ {error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" disabled={loading} style={{ ...btnPrimary, flex: 1, padding: "12px" }}>
            {loading ? "⏳ Mendaftarkan..." : "💾 Simpan Dokter"}
          </button>
          <button type="button" onClick={onClose} style={{ ...btnOutline, flex: 1, padding: "12px" }}>
            Batal
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── JANJI TEMU TAB ────────────────────────────────────────────────────────────
function JanjiTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);

    try {
      const d = await apiFetch("/janji-temu");
      setList(d.data || []);
    } catch (err) {
      console.error("Janji load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await load();
    };

    fetchData();
  }, []);

  const handleHapus = async (id) => {
    if (!confirm("Hapus janji temu ini dari sistem?")) return;
    await apiFetch(`/janji-temu/${id}`, { method: "DELETE" });
    load();
  };

  const handleUbahStatus = async (id, status) => {
    await apiFetch(`/janji-temu/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    load();
  };

  const STATUS = ["semua", "Menunggu", "Disetujui", "Selesai", "Dibatalkan"];
  const filtered = list.filter((j) => filter === "semua" || j.status === filter).filter((j) => j.nama_anak?.toLowerCase().includes(search.toLowerCase()) || j.nama_dokter?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 700, color: M[900], margin: 0 }}>Semua Janji Temu</h2>
          <p style={{ fontSize: 12, color: M[600], margin: "4px 0 0" }}>{list.length} total janji temu</p>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama anak atau dokter..."
            style={{ padding: "9px 13px 9px 32px", border: `2px solid ${M[100]}`, borderRadius: 11, fontSize: 13, color: M[900], background: "#fff", width: 250, fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
        {STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 16px",
              borderRadius: 100,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              border: "2px solid",
              borderColor: filter === s ? M[700] : M[100],
              background: filter === s ? M[700] : "#fff",
              color: filter === s ? "#fff" : M[700],
              transition: "all 0.2s",
            }}
          >
            {s === "semua" ? "Semua" : s}
            {s !== "semua" && (
              <span style={{ marginLeft: 5, background: filter === s ? "rgba(255,255,255,0.22)" : M[100], color: filter === s ? "#fff" : M[700], padding: "1px 7px", borderRadius: 100, fontSize: 10 }}>
                {list.filter((j) => j.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <Empty icon="📅" text="Tidak ada janji temu yang sesuai filter." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {filtered.map((j) => (
            <div
              key={j.id}
              style={{ background: "#fff", borderRadius: 15, padding: "14px 18px", border: `1px solid ${M[100]}`, boxShadow: `0 2px 8px rgba(26,46,20,0.04)`, transition: "all 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 8px 24px rgba(26,46,20,0.09)`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 2px 8px rgba(26,46,20,0.04)`)}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg, ${M[100]}, ${M[200]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📅</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: M[900] }}>{j.nama_anak}</div>
                    <div style={{ fontSize: 12, color: M[600] }}>
                      dr. {j.nama_dokter} · {j.spesialisasi}
                    </div>
                    <div style={{ fontSize: 11, color: M[400], marginTop: 1 }}>
                      🗓 {new Date(j.tanggal_janji).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ⏰{" "}
                      {new Date(j.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <StatusBadge status={j.status} />
                  {j.status === "Menunggu" && (
                    <button
                      onClick={() => handleUbahStatus(j.id, "Disetujui")}
                      style={{ padding: "5px 12px", borderRadius: 9, background: M[100], border: `1px solid ${M[200]}`, color: M[700], fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                    >
                      ✅ Setujui
                    </button>
                  )}
                  {(j.status === "Menunggu" || j.status === "Disetujui") && (
                    <button
                      onClick={() => handleUbahStatus(j.id, "Dibatalkan")}
                      style={{ padding: "5px 11px", borderRadius: 9, background: M.redLight, border: `1px solid #f5c6c0`, color: M.red, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                    >
                      ❌
                    </button>
                  )}
                  <button onClick={() => handleHapus(j.id)} style={{ padding: "5px 11px", borderRadius: 9, background: M[50], border: `1px solid ${M[100]}`, color: M[500], fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── REKAM MEDIS TAB ───────────────────────────────────────────────────────────
function RekamTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const d = await apiFetch("/rekam-medis");
        setList(d.data || []);
      } catch (err) {
        console.error("Rekam load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = list.filter((r) => r.nama_anak?.toLowerCase().includes(search.toLowerCase()) || r.nama_dokter?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, fontWeight: 700, color: M[900], margin: 0 }}>Semua Rekam Medis</h2>
          <p style={{ fontSize: 12, color: M[600], margin: "4px 0 0" }}>{list.length} rekam medis tersimpan</p>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama anak atau dokter..."
            style={{ padding: "9px 13px 9px 32px", border: `2px solid ${M[100]}`, borderRadius: 11, fontSize: 13, color: M[900], background: "#fff", width: 250, fontFamily: "'DM Sans', sans-serif" }}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <Empty icon="📋" text="Belum ada rekam medis tersimpan." />
      ) : (
        <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${M[100]}`, overflow: "hidden", boxShadow: `0 4px 14px rgba(26,46,20,0.05)` }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1fr", padding: "12px 18px", background: M[50], borderBottom: `1px solid ${M[100]}` }}>
            {["Nama Anak", "Dokter", "Diagnosis", "Tanggal", "Aksi"].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: M[600], textTransform: "uppercase", letterSpacing: 0.7 }}>
                {h}
              </div>
            ))}
          </div>
          {/* Rows */}
          {filtered.map((r, i) => (
            <div
              key={r.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 2fr 2fr 1.5fr 1fr", padding: "13px 18px", alignItems: "center", borderBottom: i < filtered.length - 1 ? `1px solid ${M[50]}` : "none", transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = M[50])}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${M[100]}, ${M[200]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👶</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: M[900] }}>{r.nama_anak}</span>
              </div>
              <div style={{ fontSize: 12, color: M[600] }}>{r.nama_dokter}</div>
              <div style={{ fontSize: 12, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.diagnosis ? r.diagnosis.slice(0, 32) + (r.diagnosis.length > 32 ? "..." : "") : <span style={{ color: "#d1d5db" }}>—</span>}
              </div>
              <div style={{ fontSize: 11, color: M[500] }}>{new Date(r.dibuat_pada).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</div>
              <button
                onClick={() => setDetail(r)}
                style={{ padding: "5px 13px", borderRadius: 9, background: M[50], border: `1px solid ${M[200]}`, color: M[700], fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = M[700];
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = M[50];
                  e.currentTarget.style.color = M[700];
                }}
              >
                👁️ Detail
              </button>
            </div>
          ))}
        </div>
      )}

      {detail && (
        <Modal title={`📋 ${detail.nama_anak}`} subtitle={`dr. ${detail.nama_dokter}`} onClose={() => setDetail(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[
              ["📅 Tgl Janji", new Date(detail.tanggal_janji).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })],
              ["🩺 Spesialisasi", detail.spesialisasi || "—"],
              ["📏 Tinggi", detail.tinggi_badan ? `${detail.tinggi_badan} cm` : "—"],
              ["⚖️ Berat", detail.berat_badan ? `${detail.berat_badan} kg` : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "#fff", borderRadius: 12, padding: "11px 13px", border: `1px solid ${M[100]}` }}>
                <div style={{ fontSize: 11, color: M[600], marginBottom: 4, fontWeight: 500 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: M[900] }}>{v}</div>
              </div>
            ))}
          </div>
          {[
            ["🔬 Diagnosis", detail.diagnosis],
            ["💊 Resep", detail.resep],
            ["📝 Catatan untuk Orang Tua", detail.catatan],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 9, border: `1px solid ${M[100]}` }}>
              <div style={{ fontSize: 11, color: M[600], marginBottom: 5, fontWeight: 500 }}>{k}</div>
              <div style={{ fontSize: 13, color: v ? M[900] : M[400], lineHeight: 1.6, fontStyle: v ? "normal" : "italic", fontWeight: v ? 500 : 400 }}>{v || "Belum diisi"}</div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

// ── Reusable ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Menunggu: { color: M.amberDark, bg: M.amberLight },
    Disetujui: { color: M[800], bg: M[100] },
    Selesai: { color: M.blue, bg: M.blueLight },
    Dibatalkan: { color: M.red, bg: M.redLight },
  };
  const s = map[status] || { color: "#374151", bg: "#f3f4f6" };
  return <span style={{ padding: "3px 11px", borderRadius: 100, fontSize: 11, fontWeight: 700, color: s.color, background: s.bg, whiteSpace: "nowrap" }}>{status}</span>;
}

function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 80 }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", border: `4px solid ${M[100]}`, borderTopColor: M[600], animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}

function Empty({ icon, text, small }) {
  return (
    <div style={{ textAlign: "center", padding: small ? "26px 16px" : "56px 20px", background: "#fff", borderRadius: 18, border: `2px dashed ${M[200]}` }}>
      <div style={{ fontSize: small ? 36 : 52, marginBottom: 11 }}>{icon}</div>
      <p style={{ fontSize: 13, color: M[500], maxWidth: 300, margin: "0 auto" }}>{text}</p>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(44, 74, 62, 0.15)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "40px 20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          width: "100%",
          maxWidth: 500,
          maxHeight: "85vh",
          overflow: "auto",
          border: `1px solid ${M[200]}`,
          boxShadow: "0 8px 32px rgba(44,74,62,0.18)",
          animation: "fadeUp 0.32s cubic-bezier(.16,1,.3,1) both",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        <div
          style={{
            padding: "20px 24px 18px",
            background: `linear-gradient(135deg, ${M[900]} 0%, ${M[700]} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(228,242,236,0.75)" }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 9,
              width: 30,
              height: 30,
              cursor: "pointer",
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: "20px 22px 24px", background: M[50] }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: M[900], marginBottom: 7 }}>
        <span>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  border: `2px solid ${M[100]}`,
  borderRadius: 11,
  fontSize: 13,
  color: M[900],
  background: "#fff",
  transition: "all 0.2s",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', sans-serif",
};
const btnPrimary = {
  padding: "9px 20px",
  borderRadius: 11,
  background: `linear-gradient(135deg, ${M[800]}, ${M[600]})`,
  color: "#fff",
  fontWeight: 700,
  fontSize: 13,
  border: "none",
  cursor: "pointer",
  boxShadow: `0 4px 14px rgba(61,97,48,0.28)`,
  transition: "all 0.2s",
};
const btnOutline = { padding: "9px 16px", borderRadius: 11, background: M[50], border: `1px solid ${M[200]}`, color: M[700], fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" };
