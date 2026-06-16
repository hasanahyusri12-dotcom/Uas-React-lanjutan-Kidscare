import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({ baseURL: API_URL, withCredentials: true });

const C = {
  primary: "#006036",
  primaryLight: "#eef5ef",
  primaryMint: "#80fbab",
  bg: "#f4fbf5",
  text: "#161d19",
  muted: "#3f4941",
  border: "#bec9be",
  white: "#ffffff",
  red: "#ba1a1a",
  redLight: "#fdf0f0",
};

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "children", icon: "👶", label: "Children" },
  { id: "appointments", icon: "📅", label: "Appointments" },
  { id: "records", icon: "📋", label: "Medical Records" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

// ─── HELPERS ──────────────────────────────────────────────────────
function hitungUsia(tglLahir) {
  if (!tglLahir) return "—";
  const today = new Date();
  const lahir = new Date(tglLahir);
  const bulan = (today.getFullYear() - lahir.getFullYear()) * 12 + today.getMonth() - lahir.getMonth();
  if (bulan < 12) return `${bulan} Bln`;
  return `${Math.floor(bulan / 12)} Thn`;
}

const btnPri = {
  background: C.primary,
  color: C.white,
  border: "none",
  borderRadius: 12,
  padding: "11px 22px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 7,
  boxShadow: "0 4px 16px rgba(0,96,54,0.25)",
};
const btnSec = {
  background: C.white,
  color: C.muted,
  border: `1.5px solid ${C.border}`,
  borderRadius: 12,
  padding: "11px 22px",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 7,
};
const btnDanger = {
  background: C.redLight,
  color: C.red,
  border: `1.5px solid ${C.red}30`,
  borderRadius: 12,
  padding: "11px 22px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 7,
};
const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 12,
  border: `1.5px solid ${C.border}`,
  fontSize: 14,
  color: C.text,
  background: C.white,
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: "border-box",
};

// ─── MODAL WRAPPER ────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 480 }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(22,29,25,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ background: C.white, borderRadius: 24, width: "100%", maxWidth: width, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", animation: "modalIn .2s ease", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 28px 18px", borderBottom: `1px solid ${C.border}30`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: C.bg, border: "none", borderRadius: 10, width: 34, height: 34, cursor: "pointer", fontSize: 18, color: C.muted, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
        </div>
        <div style={{ padding: "24px 28px 28px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── MODAL: TAMBAH / EDIT ANAK ────────────────────────────────────
function ModalAnak({ open, onClose, initial, onSave, onDelete }) {
  const isEdit = !!initial;
  const empty = { nama: "", tanggal_lahir: "", jenis_kelamin: "", tinggi_badan: "", berat_badan: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    queueMicrotask(() => {
      setForm(
        initial
          ? {
              nama: initial.nama || "",
              tanggal_lahir: initial.tanggal_lahir?.split("T")[0] || "",
              jenis_kelamin: initial.jenis_kelamin || "",
              tinggi_badan: initial.tinggi_badan || "",
              berat_badan: initial.berat_badan || "",
            }
          : empty,
      );
    });
  }, [initial, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.nama) return alert("Nama anak wajib diisi");
    if (!form.jenis_kelamin) return alert("Jenis kelamin wajib dipilih");
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal menyimpan data anak");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus data ${initial?.nama}?`)) return;
    setLoading(true);
    try {
      await onDelete();
      onClose();
    } catch {
      alert("Gagal menghapus data anak");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Data Anak" : "Tambah Anak Baru"}>
      <Field label="Nama Lengkap" required>
        <input style={inputStyle} placeholder="Masukkan nama anak" value={form.nama} onChange={(e) => set("nama", e.target.value)} />
      </Field>
      <Field label="Tanggal Lahir" required>
        <input style={inputStyle} type="date" value={form.tanggal_lahir} onChange={(e) => set("tanggal_lahir", e.target.value)} />
      </Field>
      <Field label="Jenis Kelamin" required>
        <select style={inputStyle} value={form.jenis_kelamin} onChange={(e) => set("jenis_kelamin", e.target.value)}>
          <option value="">Pilih jenis kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Berat Badan (kg)">
          <input style={inputStyle} type="number" placeholder="0.0" step="0.1" min="0" value={form.berat_badan} onChange={(e) => set("berat_badan", e.target.value)} />
        </Field>
        <Field label="Tinggi Badan (cm)">
          <input style={inputStyle} type="number" placeholder="0" min="0" value={form.tinggi_badan} onChange={(e) => set("tinggi_badan", e.target.value)} />
        </Field>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
        {isEdit && (
          <button onClick={handleDelete} style={btnDanger} disabled={loading}>
            🗑 Hapus
          </button>
        )}
        <button onClick={onClose} style={btnSec} disabled={loading}>
          Batal
        </button>
        <button onClick={handleSave} style={btnPri} disabled={loading}>
          {loading ? "Menyimpan..." : isEdit ? "💾 Simpan Perubahan" : "✅ Tambah Anak"}
        </button>
      </div>
    </Modal>
  );
}

// ─── MODAL: BUAT JANJI TEMU ───────────────────────────────────────
// Dropdown dokter diambil dari GET /api/dokter — tidak perlu input ID manual
function ModalJanji({ open, onClose, anakList, onSave }) {
  const empty = { anak_id: "", dokter_id: "", tanggal_janji: "", keluhan: "" };
  const [form, setForm] = useState(empty);
  const [dokterList, setDokterList] = useState([]);
  const [loadingDokter, setLoadingDokter] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!open) return;

    queueMicrotask(() => {
      setForm(empty);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const fetchDokter = async () => {
      try {
        setLoadingDokter(true);

        const res = await api.get("/api/dokter");

        setDokterList(res.data.data || res.data || []);
      } catch (err) {
        console.error(err);
        setDokterList([]);
      } finally {
        setLoadingDokter(false);
      }
    };

    fetchDokter();
  }, [open]);

  const handleSave = async () => {
    if (!form.anak_id) return alert("Pilih anak terlebih dahulu");
    if (!form.dokter_id) return alert("Pilih dokter terlebih dahulu");
    if (!form.tanggal_janji) return alert("Tanggal & waktu janji wajib diisi");
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal membuat janji temu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Buat Janji Temu" width={520}>
      {/* Pilih Anak */}
      <Field label="Pilih Anak" required>
        <select style={inputStyle} value={form.anak_id} onChange={(e) => set("anak_id", e.target.value)}>
          <option value="">-- Pilih anak --</option>
          {anakList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nama} ({hitungUsia(c.tanggal_lahir)})
            </option>
          ))}
        </select>
      </Field>

      {/* Pilih Dokter — nama + spesialisasi, bukan ID */}
      <Field label="Pilih Dokter" required>
        <select style={inputStyle} value={form.dokter_id} onChange={(e) => set("dokter_id", e.target.value)} disabled={loadingDokter}>
          <option value="">{loadingDokter ? "Memuat daftar dokter..." : "-- Pilih dokter --"}</option>
          {dokterList.map((d) => (
            <option key={d.dokter_id} value={d.dokter_id}>
              {d.nama} {d.spesialisasi ? `- ${d.spesialisasi}` : ""}
            </option>
          ))}{" "}
        </select>
        {dokterList.length === 0 && !loadingDokter && <p style={{ fontSize: 11, color: C.red, marginTop: 4 }}>Tidak ada dokter tersedia.</p>}
      </Field>

      {/* Tanggal & Waktu */}
      <Field label="Tanggal & Waktu Janji" required>
        <input style={inputStyle} type="datetime-local" value={form.tanggal_janji} onChange={(e) => set("tanggal_janji", e.target.value)} />
      </Field>

      {/* Keluhan */}
      <Field label="Keluhan / Catatan">
        <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="Tuliskan keluhan atau catatan untuk dokter..." value={form.keluhan} onChange={(e) => set("keluhan", e.target.value)} />
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={btnSec} disabled={loading}>
          Batal
        </button>
        <button onClick={handleSave} style={btnPri} disabled={loading || loadingDokter}>
          {loading ? "Menyimpan..." : "📅 Buat Janji"}
        </button>
      </div>
    </Modal>
  );
}

// ─── SUB COMPONENTS ───────────────────────────────────────────────
function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}50`, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: iconBg, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: C.muted, marginBottom: 3 }}>{label}</p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.primary }}>{value}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit }) {
  return (
    <div style={{ background: C.bg, borderRadius: 14, padding: "14px 12px", textAlign: "center", border: `1px solid ${C.border}40` }}>
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: C.muted, marginBottom: 5 }}>{label}</p>
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.primary }}>{value}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: C.muted, marginLeft: 3 }}>{unit}</span>
    </div>
  );
}

function ChildCard({ child, onEdit }) {
  return (
    <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: "22px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: `${C.primary}07`, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, position: "relative", zIndex: 1 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${C.primary}`, padding: 3, background: C.white, overflow: "hidden", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,96,54,0.15)" }}>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(child.nama)}&background=9bf6ba&color=006036&bold=true&size=128`}
            alt={child.nama}
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text }}>
              {child.nama}
              {child.tanggal_lahir && ` (${hitungUsia(child.tanggal_lahir)})`}
            </h3>
            <span style={{ background: C.primaryMint, color: "#00743f", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>IDEAL</span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, opacity: 0.75 }}>
            {child.jenis_kelamin} • {child.tanggal_lahir ? new Date(child.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
          </p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, position: "relative", zIndex: 1 }}>
        <MiniStat label="Berat" value={child.berat_badan || "—"} unit="kg" />
        <MiniStat label="Tinggi" value={child.tinggi_badan || "—"} unit="cm" />
        <div
          onClick={() => onEdit && onEdit(child)}
          style={{
            background: C.bg,
            borderRadius: 14,
            padding: "14px 12px",
            textAlign: "center",
            border: `1px solid ${C.border}40`,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 20 }}>✏️</span>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: C.muted, opacity: 0.7 }}>Edit</p>
        </div>
      </div>
    </div>
  );
}

function RecordList({ records, onViewAll }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      {onViewAll && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>Riwayat Medis Terkini</h4>
          <span onClick={onViewAll} style={{ color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Lihat Semua →
          </span>
        </div>
      )}
      {records.length === 0 ? (
        <div style={{ textAlign: "center", padding: "28px", background: C.white, borderRadius: 18, border: `1px dashed ${C.border}` }}>
          <p style={{ color: C.muted, fontSize: 13, opacity: 0.6, fontStyle: "italic" }}>Belum ada riwayat medis.</p>
        </div>
      ) : (
        records.map((rec) => (
          <div key={rec.id} style={{ background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, marginBottom: 10, overflow: "hidden" }}>
            {/* Header baris */}
            <div onClick={() => setExpanded(expanded === rec.id ? null : rec.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: `1px solid ${C.border}30`, flexShrink: 0 }}>
                {rec.diagnosis?.toLowerCase().includes("vaksin") || rec.diagnosis?.toLowerCase().includes("imunisasi") ? "💉" : "🩺"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 3 }}>{rec.diagnosis || "Pemeriksaan"}</p>
                <p style={{ fontSize: 11, color: C.muted, opacity: 0.7, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span>📅 {rec.dibuat_pada ? new Date(rec.dibuat_pada).toLocaleDateString("id-ID") : "—"}</span>
                  {rec.nama_dokter && <span>👤 dr. {rec.nama_dokter}</span>}
                </p>
              </div>
              <span style={{ color: C.border, fontSize: 18, transition: "transform 0.2s", display: "inline-block", transform: expanded === rec.id ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
            </div>

            {/* Detail expand */}
            {expanded === rec.id && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${C.border}30` }}>
                {/* Tanda vital */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 0 10px" }}>
                  {[
                    ["📏 Tinggi", rec.tinggi_badan ? `${rec.tinggi_badan} cm` : null],
                    ["⚖️ Berat", rec.berat_badan ? `${rec.berat_badan} kg` : null],
                    ["🌡️ Suhu", rec.suhu ? `${rec.suhu} °C` : null],
                    ["💓 Tekanan Darah", rec.tekanan_darah || null],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} style={{ background: C.bg, borderRadius: 10, padding: "9px 12px", border: `1px solid ${C.border}30` }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{v}</div>
                      </div>
                    ))}
                </div>

                {/* Info teks */}
                {[
                  ["🏥 Tindakan", rec.tindakan],
                  ["💊 Resep", rec.resep],
                  ["📝 Catatan untuk Orang Tua", rec.catatan],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", marginBottom: 7, border: `1px solid ${C.border}30` }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{k}</div>
                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{v}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function AppointmentCard({ appt, onDetail }) {
  return (
    <div
      style={{ background: "linear-gradient(135deg, #006036 0%, #1a7a4a 100%)", borderRadius: 24, padding: "22px", color: C.white, marginBottom: 16, boxShadow: "0 12px 32px rgba(0,96,54,0.25)", position: "relative", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", bottom: -20, right: -20, fontSize: 110, opacity: 0.07, pointerEvents: "none" }}>📅</div>
      <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", fontSize: 9, fontWeight: 700, padding: "5px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
        Upcoming Appointment
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          👩‍⚕️
        </div>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 3 }}>{appt.nama_dokter}</p>
          <p style={{ fontSize: 11, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{appt.spesialisasi || "Spesialis Anak"}</p>
        </div>
      </div>
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 9 }}>
        {[
          { icon: "📅", text: new Date(appt.tanggal_janji).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" }) },
          { icon: "🕐", text: `${new Date(appt.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB` },
          appt.lokasi ? { icon: "📍", text: appt.lokasi } : null,
        ]
          .filter(Boolean)
          .map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600 }}>
              <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{row.icon}</span>
              <span>{row.text}</span>
            </div>
          ))}
      </div>
      <button
        onClick={() => onDetail(appt)}
        style={{
          width: "100%",
          background: C.white,
          color: C.primary,
          border: "none",
          borderRadius: 14,
          padding: "13px",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Lihat Detail Janji
      </button>{" "}
    </div>
  );
}

function TipsCard({ tips }) {
  const isDokter = tips?.startsWith("💬 Pesan dari dr.");

  return (
    <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${isDokter ? C.primary : C.border}50`, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: isDokter ? C.primary : `${C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{isDokter ? "👨‍⚕️" : "💡"}</div>
      <div>
        <p style={{ fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 5 }}>{isDokter ? "Pesan dari Dokter" : "Tips Kesehatan"}</p>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{isDokter ? tips.replace(/^💬 Pesan dari dr\.\s[\w\s]+:\s"?/, "").replace(/"$/, "") : tips}</p>
        {isDokter && <p style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginTop: 6 }}>— {tips.match(/dr\.\s([\w\s]+):/)?.[1] || "Dokter"}</p>}
      </div>
    </div>
  );
}

function EmptyState({ icon, msg, action, onAction }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px", background: C.white, borderRadius: 24, border: `2px dashed ${C.border}` }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: action ? 20 : 0 }}>{msg}</p>
      {action && (
        <button onClick={onAction} style={{ ...btnPri, display: "inline-flex" }}>
          {action}
        </button>
      )}
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.text }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={btnPri}>
          {action}
        </button>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────
function PageHome({ data, onNavigate, onOpenJanji, onDetailJanji }) {
  const child = data.children[0];
  const appt = data.appointments.find((a) => a.status === "Disetujui" || a.status === "Menunggu") || data.appointments[0];

  return (
    <div>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 4 }}>Halo, Bapak/Ibu!</h2>
        <p style={{ color: C.muted, fontSize: 15, opacity: 0.85 }}>Pantau pertumbuhan si kecil hari ini.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={() => onNavigate("children")} style={btnPri}>
            ➕ Tambah Anak
          </button>
          <button onClick={onOpenJanji} style={btnSec}>
            📅 Buat Janji
          </button>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard icon="👨‍👩‍👧" iconBg="#80fbab30" iconColor="#006d3b" label="Total Anak" value={`${data.children.length} Terdaftar`} />
        <StatCard icon="🕐" iconBg={`${C.primary}18`} iconColor={C.primary} label="Janji Mendatang" value={appt ? new Date(appt.tanggal_janji).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "Belum Ada"} />
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div>
          {child ? <ChildCard child={child} /> : <EmptyState icon="👶" msg="Belum ada data anak." action="➕ Tambah Anak" onAction={() => onNavigate("children")} />}
          <div style={{ marginTop: 20 }}>
            <RecordList records={data.records.slice(0, 3)} onViewAll={() => onNavigate("records")} />
          </div>
        </div>
        <div>
          {appt ? (
            <AppointmentCard appt={appt} onDetail={onDetailJanji} />
          ) : (
            <div style={{ textAlign: "center", padding: "32px 20px", background: C.primaryLight, borderRadius: 24, border: `2px dashed ${C.primary}30`, marginBottom: 16 }}>
              <p style={{ color: C.primary, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Tidak ada janji temu mendatang.</p>
              <button onClick={onOpenJanji} style={{ ...btnPri, display: "inline-flex" }}>
                📅 Buat Janji Baru
              </button>
            </div>
          )}
          {data.tips && <TipsCard tips={data.tips} />}
        </div>
      </div>
    </div>
  );
}

function PageChildren({ children, onAdd, onEdit }) {
  return (
    <div>
      <SectionHeader title="Data Anak" action="➕ Tambah Anak" onAction={onAdd} />
      {children.length === 0 ? (
        <EmptyState icon="👶" msg="Belum ada data anak terdaftar." action="➕ Tambah Anak" onAction={onAdd} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {children.map((child) => (
            <ChildCard key={child.id} child={child} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageAppointments({ appointments, onAdd }) {
  const statusStyle = (s) =>
    ({
      Disetujui: { bg: "#e6f4ec", color: "#006036" },
      Menunggu: { bg: "#fff8e1", color: "#b45309" },
      Selesai: { bg: "#e8f5e9", color: "#2e7d32" },
      Ditolak: { bg: C.redLight, color: C.red },
    })[s] || { bg: C.bg, color: C.muted };

  return (
    <div>
      <SectionHeader title="Janji Temu" action="📅 Buat Janji" onAction={onAdd} />
      {appointments.length === 0 ? (
        <EmptyState icon="📅" msg="Belum ada janji temu." action="📅 Buat Janji" onAction={onAdd} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {appointments.map((a) => {
            const sc = statusStyle(a.status);
            return (
              <div key={a.id} style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: "18px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👩‍⚕️</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 3 }}>dr. {a.nama_dokter}</p>
                  <p style={{ fontSize: 12, color: C.muted, opacity: 0.8, marginBottom: 4 }}>
                    {a.spesialisasi || "Spesialis Anak"}
                    {a.nama_anak ? ` • untuk ${a.nama_anak}` : ""}
                  </p>
                  <p style={{ fontSize: 12, color: C.muted }}>
                    📅 {new Date(a.tanggal_janji).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    &nbsp;&nbsp;🕐 {new Date(a.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                  </p>
                </div>
                <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{a.status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PageRecords({ records }) {
  return (
    <div>
      <SectionHeader title="Rekam Medis" />
      {records.length === 0 ? <EmptyState icon="🩺" msg="Belum ada riwayat medis." /> : <RecordList records={records} />}
    </div>
  );
}

// ─── PAGE: SETTINGS ──────────────────────────────────────────────
function PageSettings({ user, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nama: user?.nama || "",
    no_hp: user?.no_hp || "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

useEffect(() => {
  if (!user) return;

  setForm(prev => ({
    ...prev,
    nama: user.nama || "",
    no_hp: user.no_hp || "",
  }));
}, [user]);


  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setForm({
      nama: user?.nama || "",
      no_hp: user?.no_hp || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!form.nama.trim()) return alert("Nama lengkap tidak boleh kosong");

    setLoading(true);
    try {
      await onUpdate(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const konfirmasi = window.confirm(
      "Yakin ingin menghapus akun? Semua data anak, janji temu, dan rekam medis akan hilang permanen."
    );
    if (!konfirmasi) return;

    try {
      await onDelete();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus akun");
    }
  };

  return (
    <div>
      <SectionHeader title="Pengaturan" />

      <div
        style={{
          background: C.white,
          borderRadius: 24,
          border: `1px solid ${C.border}`,
          padding: 28,
          maxWidth: 540,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          position: "relative",
        }}
      >
        {/* Header + Tombol Edit */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: C.primaryMint,
                color: C.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              {form.nama?.charAt(0)?.toUpperCase() || "O"}
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
                {user?.nama || "—"}
              </p>
              <p style={{ color: C.muted, marginTop: 4 }}>{user?.email || "—"}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={handleEdit}
              style={{
                ...btnPri,
                padding: "10px 22px",
                fontSize: 14,
              }}
            >
              ✏️ Edit Profil
            </button>
          )}
        </div>

        {/* Isi Form */}
        {isEditing ? (
          // MODE EDIT
          <>
            <Field label="Nama Lengkap" required>
              <input
                style={inputStyle}
                value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                placeholder="Masukkan nama lengkap"
              />
            </Field>

            <Field label="Nomor HP">
              <input
                style={inputStyle}
                value={form.no_hp}
                onChange={(e) => setForm((f) => ({ ...f, no_hp: e.target.value }))}
                placeholder="08xxxxxxxxxx"
              />
            </Field>

            <Field label="Email">
              <input style={{ ...inputStyle, background: C.bg, color: C.muted }} value={user?.email} readOnly />
            </Field>

            <Field label="Peran">
              <input style={{ ...inputStyle, background: C.bg, color: C.muted }} value="Orang Tua" readOnly />
            </Field>

            {/* Tombol Aksi di Bawah */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
              <button onClick={handleDelete} style={btnDanger}>
                🗑 Hapus Akun
              </button>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleCancel} style={btnSec} disabled={loading}>
                  Batal
                </button>
                <button onClick={handleSave} style={btnPri} disabled={loading}>
                  {loading ? "Menyimpan..." : "💾 Simpan Perubahan"}
                </button>
              </div>
            </div>
          </>
        ) : (
          // MODE TAMPILAN (Read Only)
          <>
            <Field label="Nama Lengkap">
              <div style={{ ...inputStyle, background: C.bg, color: C.text, cursor: "default", padding: "12px 14px" }}>
                {user?.nama || "—"}
              </div>
            </Field>

            <Field label="Nomor HP">
              <div style={{ ...inputStyle, background: C.bg, color: C.text, cursor: "default", padding: "12px 14px" }}>
                {user?.no_hp || "—"}
              </div>
            </Field>

            <Field label="Email">
              <div style={{ ...inputStyle, background: C.bg, color: C.muted, cursor: "default", padding: "12px 14px" }}>
                {user?.email || "—"}
              </div>
            </Field>

            <Field label="Peran">
              <div style={{ ...inputStyle, background: C.bg, color: C.muted, cursor: "default", padding: "12px 14px" }}>
                Orang Tua
              </div>
            </Field>
          </>
        )}

        {saved && (
          <p style={{ color: "#2e7d32", fontWeight: 600, textAlign: "center", marginTop: 16 }}>
            ✅ Perubahan berhasil disimpan
          </p>
        )}
      </div>
    </div>
  );
}
// ─── ROOT COMPONENT ───────────────────────────────────────────────
export default function DashboardOrangTua() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ children: [], appointments: [], records: [], tips: "" });
  const [user, setUser] = useState(null);
  const [modalAnak, setModalAnak] = useState(false);
  const [modalJanji, setModalJanji] = useState(false);
  const [detailJanji, setDetailJanji] = useState(null);
  const [modalDetailJanji, setModalDetailJanji] = useState(false);
  const [editChild, setEditChild] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [anakRes, janjiRes, rekamRes, userRes] = await Promise.all([api.get("/api/anak"), api.get("/api/janji-temu"), api.get("/api/rekam-medis"), api.get("/api/auth/me")]);

      const rekamData = rekamRes.data.data || rekamRes.data || [];
      const catatanTerbaru = rekamData.find((r) => r.catatan);

      setData({
        children: anakRes.data.data || anakRes.data || [],
        appointments: janjiRes.data.data || janjiRes.data || [],
        records: rekamData,
        tips: catatanTerbaru ? `💬 Pesan dari dr. ${catatanTerbaru.nama_dokter}: "${catatanTerbaru.catatan}"` : "Jangan lupa berikan ASI eksklusif dan pastikan si kecil mendapat tidur yang cukup untuk tumbuh kembang yang optimal.",
      });

      if (userRes.data?.user) setUser(userRes.data.user);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data. Silakan login kembali.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchAll();
    };

    load();
  }, []);

  const openTambahAnak = () => {
    setEditChild(null);
    setModalAnak(true);
  };
  const openEditAnak = (child) => {
    setEditChild(child);
    setModalAnak(true);
  };

  const saveAnak = async (form) => {
    if (editChild) await api.put(`/api/anak/${editChild.id}`, form);
    else await api.post("/api/anak", form);
    await fetchAll();
  };

  const deleteAnak = async () => {
    await api.delete(`/api/anak/${editChild.id}`);
    await fetchAll();
  };

  const updateProfil = async (form) => {
    await api.put("/api/auth/profil", form);
    await fetchAll();
  };

  const deleteAkun = async () => {
    await api.delete("/api/auth/akun");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const saveJanji = async (form) => {
    await api.post("/api/janji-temu", form);
    await fetchAll();
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>
        <div style={{ width: 44, height: 44, border: `4px solid ${C.primary}20`, borderTopColor: C.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16 }} />
        <p style={{ color: C.primary, fontWeight: 600, fontSize: 14 }}>Menyinkronkan data...</p>
      </div>
    );

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return (
          <PageHome
            data={data}
            user={user}
            onNavigate={setActiveTab}
            onOpenJanji={() => setModalJanji(true)}
            onDetailJanji={(appt) => {
              setDetailJanji(appt);
              setModalDetailJanji(true);
            }}
          />
        );
      case "children":
        return <PageChildren children={data.children} onAdd={openTambahAnak} onEdit={openEditAnak} />;
      case "appointments":
        return <PageAppointments appointments={data.appointments} onAdd={() => setModalJanji(true)} />;
      case "records":
        return <PageRecords records={data.records} />;
      case "settings":
        return <PageSettings user={user} onUpdate={updateProfil} onDelete={deleteAkun} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; font-family: 'DM Sans', sans-serif; }

        .kc-scroll::-webkit-scrollbar { display: none; }

        /* Sidebar selalu terbuka di Laptop/Desktop */
        .sidebar {
          position: fixed;
          top: 0; left: 0;
          width: 220px;
          height: 100vh;
          background: ${C.white};
          border-right: 1px solid ${C.border}40;
          z-index: 1000;
          box-shadow: 2px 0 12px rgba(0,0,0,0.06);
        }

        .main-content {
          margin-left: 220px;
          transition: margin-left 0.3s ease;
        }

        /* Mobile Only */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 260px;
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-content {
            margin-left: 0 !important;
          }
          .hamburger {
            display: block !important;
            font-size: 28px;
          }
          main { padding: 16px !important; }
        }

        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>

      {/* Modals */}
      <ModalAnak open={modalAnak} onClose={() => setModalAnak(false)} initial={editChild} onSave={saveAnak} onDelete={deleteAnak} />
      <ModalJanji open={modalJanji} onClose={() => setModalJanji(false)} anakList={data.children} onSave={saveJanji} />
      <Modal open={modalDetailJanji} onClose={() => setModalDetailJanji(false)} title="Detail Janji Temu" width={500}>
        {detailJanji && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p><strong>👨‍⚕️ Dokter:</strong> {detailJanji.nama_dokter}</p>
            <p><strong>🩺 Spesialisasi:</strong> {detailJanji.spesialisasi || "-"}</p>
            <p><strong>👶 Anak:</strong> {detailJanji.nama_anak || "-"}</p>
            <p><strong>📅 Tanggal:</strong> {new Date(detailJanji.tanggal_janji).toLocaleDateString("id-ID")}</p>
            <p><strong>🕐 Jam:</strong> {new Date(detailJanji.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        )}
      </Modal>

      <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>

        {/* SIDEBAR */}
        <aside className={`sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <div style={{ padding: "26px 20px 22px", borderBottom: `1px solid ${C.border}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#006036,#1a7a4a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌿</div>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.primary }}>KidsCare</p>
                <p style={{ fontSize: 10, color: C.muted }}>PARENT DASHBOARD</p>
              </div>
            </div>
          </div>

          <nav style={{ padding: "14px 12px", flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 13, border: "none",
                    background: active ? C.primaryLight : "transparent",
                    color: active ? C.primary : C.muted,
                    fontWeight: active ? 700 : 500,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div style={{ padding: "12px", borderTop: `1px solid ${C.border}30` }}>
            <button onClick={fetchAll} style={{ width: "100%", padding: "11px", borderRadius: 12, border: `1px solid ${C.border}`, background: "transparent", marginBottom: 8 }}>🔄 Refresh Data</button>
            <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }} style={{ width: "100%", padding: "11px", borderRadius: 12, background: C.redLight, color: C.red, border: "none", fontWeight: 700 }}>🚪 Keluar</button>
          </div>
        </aside>

        {/* OVERLAY (hanya muncul di HP) */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="main-content" style={{ flex: 1 }}>
          <header style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px)",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.border}40`,
            position: "sticky",
            top: 0,
            zIndex: 90,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button 
                className="hamburger"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                ☰
              </button>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, margin: 0 }}>
                {NAV_ITEMS.find(n => n.id === activeTab)?.label || "Dashboard"}
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button style={{ width: 40, height: 40, borderRadius: "50%", background: C.primaryLight, border: "none", fontSize: 20 }}>🔔</button>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.primaryMint, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {user?.nama?.charAt(0) || "U"}
              </div>
            </div>
          </header>

          <main className="kc-scroll" style={{ padding: "24px 20px" }}>
            {error && <div style={{ padding: 16, background: C.redLight, color: C.red, borderRadius: 12, marginBottom: 20 }}>{error}</div>}
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}