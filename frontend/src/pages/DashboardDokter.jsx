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
  yellow: "#fff8e1",
  yellowText: "#b45309",
};

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "schedule", icon: "📅", label: "Jadwal" },
  { id: "patients", icon: "👥", label: "Pasien" },
  { id: "profile", icon: "👤", label: "Profil" },
];

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
const btnSec = { background: C.white, color: C.muted, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "11px 22px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 };
const btnDanger = { background: C.redLight, color: C.red, border: `1.5px solid ${C.red}30`, borderRadius: 12, padding: "11px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer" };
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

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
          {required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: C.muted, opacity: 0.6 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { Disetujui: { bg: "#e6f4ec", color: "#006036" }, Menunggu: { bg: C.yellow, color: C.yellowText }, Selesai: { bg: "#e8f5e9", color: "#2e7d32" }, Ditolak: { bg: C.redLight, color: C.red } };
  const s = map[status] || { bg: C.bg, color: C.muted };
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── MODAL: REKAM MEDIS ────────────────────────────────────────────
// Muncul saat dokter klik "Tandai Selesai" — wajib isi sebelum status berubah
function ModalRekamMedis({ open, onClose, appt, onSave }) {
  const emptyForm = { diagnosis: "", tindakan: "", resep: "", catatan_dokter: "", tekanan_darah: "", berat_badan: "", tinggi_badan: "", suhu: "" };
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setForm(emptyForm);
      }, 0);
    }
  }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.diagnosis.trim()) return alert("Diagnosis wajib diisi sebelum menyelesaikan pemeriksaan.");
    setLoading(true);
    try {
      await onSave(appt.id, form);
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal menyimpan rekam medis");
    } finally {
      setLoading(false);
    }
  };

  if (!appt) return null;

  return (
    <Modal open={open} onClose={onClose} title="📋 Rekam Medis Pasien" width={560}>
      {/* Info pasien — readonly summary */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, #1a7a4a)`, borderRadius: 16, padding: "16px 20px", marginBottom: 22, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: C.white, flexShrink: 0 }}>
          {appt.nama_anak?.charAt(0)}
        </div>
        <div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 2 }}>{appt.nama_anak}</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
            📅 {new Date(appt.tanggal_janji).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
            &nbsp;·&nbsp;🕐 {new Date(appt.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
          </p>
          {appt.keluhan && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>💬 {appt.keluhan}</p>}
        </div>
      </div>

      {/* Vital signs — grid 2x2 */}
      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Tanda Vital</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { key: "suhu", label: "Suhu (°C)", placeholder: "cth: 37.5" },
          { key: "tekanan_darah", label: "Tekanan Darah", placeholder: "cth: 110/70" },
          { key: "berat_badan", label: "Berat Badan (kg)", placeholder: "cth: 15" },
          { key: "tinggi_badan", label: "Tinggi Badan (cm)", placeholder: "cth: 95" },
        ].map((f) => (
          <div key={f.key}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{f.label}</label>
            <input style={inputStyle} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
          </div>
        ))}
      </div>

      {/* Diagnosis */}
      <Field label="Diagnosis" required hint="wajib diisi">
        <input style={inputStyle} placeholder="cth: ISPA ringan, Demam berdarah, GTM..." value={form.diagnosis} onChange={(e) => set("diagnosis", e.target.value)} />
      </Field>

      {/* Tindakan */}
      <Field label="Tindakan / Terapi">
        <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="cth: Pemberian cairan infus, kompres hangat, edukasi orang tua..." value={form.tindakan} onChange={(e) => set("tindakan", e.target.value)} />
      </Field>

      {/* Resep */}
      <Field label="Resep Obat" hint="opsional">
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder={"cth:\n- Paracetamol syr 3x1 cth\n- Amoxicillin 3x250mg\n- Vitamin C 1x1 tab"} value={form.resep} onChange={(e) => set("resep", e.target.value)} />
      </Field>

      {/* Catatan tambahan */}
      <Field label="Catatan untuk Orang Tua" hint="opsional">
        <textarea
          style={{ ...inputStyle, minHeight: 64, resize: "vertical" }}
          placeholder="cth: Istirahat cukup, minum air putih yang banyak, kontrol ulang 3 hari lagi jika tidak membaik..."
          value={form.catatan_dokter}
          onChange={(e) => set("catatan_dokter", e.target.value)}
        />
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}30` }}>
        <button onClick={onClose} style={btnSec} disabled={loading}>
          Batal
        </button>
        <button onClick={handleSave} style={{ ...btnPri, background: "#2e7d32" }} disabled={loading}>
          {loading ? "Menyimpan..." : "🏁 Simpan & Selesaikan"}
        </button>
      </div>
    </Modal>
  );
}

// ─── MODAL: UPDATE STATUS JANJI ────────────────────────────────────
function ModalStatusJanji({ open, onClose, appt, onUpdate, onSelesai }) {
  const [loading, setLoading] = useState(false);
  if (!appt) return null;

  const handleUpdate = async (status) => {
    // "Selesai" → buka modal rekam medis dulu
    if (status === "Selesai") {
      onClose();
      onSelesai(appt);
      return;
    }
    setLoading(true);
    try {
      await onUpdate(appt.id, status);
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Status Janji" width={440}>
      <div style={{ marginBottom: 20, padding: "16px", background: C.bg, borderRadius: 14 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{appt.nama_anak}</p>
        <p style={{ fontSize: 13, color: C.muted }}>
          📅 {new Date(appt.tanggal_janji).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          &nbsp;&nbsp;🕐 {new Date(appt.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
        </p>
        {appt.keluhan && <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>💬 {appt.keluhan}</p>}
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Ubah Status Menjadi:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => handleUpdate("Disetujui")} disabled={loading} style={{ ...btnPri, justifyContent: "center" }}>
          ✅ Setujui Janji
        </button>
        {/* Selesai → wajib isi rekam medis dulu */}
        <button
          onClick={() => handleUpdate("Selesai")}
          disabled={loading}
          style={{ background: "#2e7d32", color: C.white, border: "none", borderRadius: 12, padding: "11px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
        >
          🏁 Tandai Selesai + Isi Rekam Medis
        </button>
        <button onClick={() => handleUpdate("Ditolak")} disabled={loading} style={{ ...btnDanger, borderRadius: 12, padding: "11px 22px", display: "flex", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
          ❌ Tolak Janji
        </button>
      </div>
      <p style={{ fontSize: 11, color: C.muted, marginTop: 14, opacity: 0.65, textAlign: "center" }}>💡 "Tandai Selesai" akan membuka form rekam medis — diagnosis wajib diisi.</p>
    </Modal>
  );
}

// ─── MODAL: PROFIL DOKTER ──────────────────────────────────────────
function ModalProfilDokter({ open, onClose, dokter, onUpdate }) {
  const [form, setForm] = useState({ spesialisasi: dokter?.spesialisasi || "", jadwal_praktik: dokter?.jadwal_praktik || "" });
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(form);
      onClose();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Edit Profil Medis" width={460}>
      <Field label="Spesialisasi">
        <input style={inputStyle} placeholder="cth: Spesialis Anak" value={form.spesialisasi} onChange={(e) => setForm((f) => ({ ...f, spesialisasi: e.target.value }))} />
      </Field>
      <Field label="Jadwal Praktik">
        <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="cth: Senin-Jumat, 08:00-12:00" value={form.jadwal_praktik} onChange={(e) => setForm((f) => ({ ...f, jadwal_praktik: e.target.value }))} />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onClose} style={btnSec} disabled={loading}>
          Batal
        </button>
        <button onClick={handleSave} style={btnPri} disabled={loading}>
          {loading ? "Menyimpan..." : "💾 Simpan"}
        </button>
      </div>
    </Modal>
  );
}

// ─── PAGE: HOME ────────────────────────────────────────────────────
function PageHome({ data, user, onOpenStatus, onNavigate }) {
  const next = data.appointments.find((a) => a.status === "Disetujui" || a.status === "Menunggu");
  const queue = data.appointments.filter((a) => a.status === "Menunggu" || a.status === "Disetujui").slice(0, 5);
  const total = data.appointments.length;
  const selesai = data.appointments.filter((a) => a.status === "Selesai").length;
  const menunggu = data.appointments.filter((a) => a.status === "Menunggu").length;

  return (
    <div>
      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.text, marginBottom: 4 }}>Halo, dr. {user?.nama?.split(" ")[0] || "Dokter"}!</h2>
        <p style={{ color: C.muted, fontSize: 15, opacity: 0.85 }}>
          Anda memiliki <strong style={{ color: C.primary }}>{menunggu} pasien menunggu</strong> konfirmasi hari ini.
        </p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { icon: "📋", iconBg: `${C.primary}15`, iconColor: C.primary, label: "Total Janji", value: `${total} Pasien` },
          { icon: "✅", iconBg: "#e8f5e9", iconColor: "#2e7d32", label: "Selesai", value: `${selesai} Pasien` },
          { icon: "⏳", iconBg: C.yellow, iconColor: C.yellowText, label: "Menunggu", value: `${menunggu} Pasien` },
        ].map((s, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}50`, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: s.iconBg, color: s.iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: C.muted, marginBottom: 3 }}>{s.label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.primary }}>{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        <div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>Pasien Berikutnya</h4>
              <span style={{ background: "#80fbab30", color: C.primary, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>LIVE</span>
            </div>
            {next ? (
              <div style={{ background: "linear-gradient(135deg, #006036 0%, #1a7a4a 100%)", borderRadius: 24, padding: "24px", color: C.white, boxShadow: "0 12px 32px rgba(0,96,54,0.25)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, position: "relative", zIndex: 1 }}>
                  <div>
                    <p style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Pasien Berikutnya</p>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{next.nama_anak}</h3>
                    <p style={{ fontSize: 13, opacity: 0.85 }}>🕐 {new Date(next.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</p>
                  </div>
                  <StatusBadge status={next.status} />
                </div>
                {next.keluhan && (
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, position: "relative", zIndex: 1 }}>
                    <p style={{ fontSize: 12, opacity: 0.8, fontWeight: 600, marginBottom: 3 }}>💬 Keluhan Pasien</p>
                    <p style={{ fontSize: 13 }}>{next.keluhan}</p>
                  </div>
                )}
                <button
                  onClick={() => onOpenStatus(next)}
                  style={{ width: "100%", background: C.white, color: C.primary, border: "none", borderRadius: 14, padding: "13px", fontWeight: 700, fontSize: 13, cursor: "pointer", position: "relative", zIndex: 1 }}
                >
                  Update Status Janji
                </button>
              </div>
            ) : (
              <div style={{ padding: "40px 24px", background: C.white, borderRadius: 24, border: `2px dashed ${C.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <p style={{ color: C.muted, fontSize: 14 }}>Tidak ada pasien dalam antrian saat ini.</p>
              </div>
            )}
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>Antrean Pasien</h4>
              <span onClick={() => onNavigate("schedule")} style={{ color: C.primary, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Lihat Semua →
              </span>
            </div>
            {queue.length === 0 ? (
              <div style={{ padding: "28px", background: C.white, borderRadius: 18, border: `1px dashed ${C.border}`, textAlign: "center" }}>
                <p style={{ color: C.muted, fontSize: 13, opacity: 0.6, fontStyle: "italic" }}>Antrean kosong.</p>
              </div>
            ) : (
              queue.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onOpenStatus(item)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: C.white, borderRadius: 18, border: `1px solid ${C.border}`, marginBottom: 10, cursor: "pointer" }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: ["#e8f5e9", "#fff8e1", "#e3f2fd", "#fce4ec"][idx % 4],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 16,
                      color: C.primary,
                      flexShrink: 0,
                    }}
                  >
                    {item.nama_anak?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{item.nama_anak}</p>
                    <p style={{ fontSize: 11, color: C.muted, opacity: 0.7 }}>🕐 {new Date(item.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div style={{ background: C.white, borderRadius: 24, border: `1px solid ${C.border}`, padding: "22px 24px", marginBottom: 16 }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>Ringkasan Hari Ini</h4>
            {[
              { label: "Total Janji", value: total, color: C.primary },
              { label: "Menunggu", value: menunggu, color: C.yellowText },
              { label: "Disetujui", value: data.appointments.filter((a) => a.status === "Disetujui").length, color: C.primary },
              { label: "Selesai", value: selesai, color: "#2e7d32" },
              { label: "Ditolak", value: data.appointments.filter((a) => a.status === "Ditolak").length, color: C.red },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}20` }}>
                <span style={{ fontSize: 13, color: C.muted }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.color }}>{row.value} pasien</span>
              </div>
            ))}
          </div>
          <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}50`, padding: "18px 20px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Progress Hari Ini</p>
            <div style={{ background: C.bg, borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ background: `linear-gradient(90deg, ${C.primary}, #1a7a4a)`, height: "100%", width: total > 0 ? `${(selesai / total) * 100}%` : "0%", borderRadius: 8, transition: "width 0.6s ease" }} />
            </div>
            <p style={{ fontSize: 12, color: C.muted }}>
              <strong style={{ color: C.primary }}>{selesai}</strong> dari {total} pasien selesai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: JADWAL ──────────────────────────────────────────────────
function PageJadwal({ appointments, onOpenStatus }) {
  const [filter, setFilter] = useState("Semua");
  const filters = ["Semua", "Menunggu", "Disetujui", "Selesai", "Ditolak"];
  const filtered = filter === "Semua" ? appointments : appointments.filter((a) => a.status === filter);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.text }}>Jadwal Janji Temu</h3>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: `1.5px solid ${filter === f ? C.primary : C.border}`,
              background: filter === f ? C.primary : C.white,
              color: filter === f ? C.white : C.muted,
              fontWeight: 600,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", background: C.white, borderRadius: 24, border: `2px dashed ${C.border}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <p style={{ color: C.muted, fontSize: 14 }}>Tidak ada jadwal dengan status "{filter}".</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((a) => (
            <div key={a.id} onClick={() => onOpenStatus(a)} style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: "18px 20px", display: "flex", gap: 16, alignItems: "center", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: C.primary, flexShrink: 0 }}>
                {a.nama_anak?.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 3 }}>{a.nama_anak}</p>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 3 }}>
                  📅 {new Date(a.tanggal_janji).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  &nbsp;&nbsp;🕐 {new Date(a.tanggal_janji).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                </p>
                {a.keluhan && <p style={{ fontSize: 12, color: C.muted, opacity: 0.7 }}>💬 {a.keluhan}</p>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <StatusBadge status={a.status} />
                <span style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>{a.status === "Selesai" ? "✅ Selesai" : "Klik untuk update →"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGE: PASIEN ──────────────────────────────────────────────────
function PagePasien({ appointments, rekamMedis = [] }) {
  const [selected, setSelected] = useState(null);

  const pasienMap = {};
  appointments.forEach((a) => {
    if (!pasienMap[a.nama_anak]) pasienMap[a.nama_anak] = { nama: a.nama_anak, janji: [] };
    pasienMap[a.nama_anak].janji.push(a);
  });
  const pasienList = Object.values(pasienMap);

  const rekamPasien = selected ? rekamMedis.filter((r) => r.nama_anak === selected) : [];

  return (
    <div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 20 }}>Daftar Pasien</h3>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.4fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, alignItems: "start" }}>
        {/* List pasien */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pasienList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: C.white, borderRadius: 24, border: `2px dashed ${C.border}` }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
              <p style={{ color: C.muted, fontSize: 14 }}>Belum ada pasien.</p>
            </div>
          ) : (
            pasienList.map((p, i) => (
              <div
                key={p.nama}
                onClick={() => setSelected(selected === p.nama ? null : p.nama)}
                style={{ background: selected === p.nama ? C.primaryLight : C.white, borderRadius: 20, border: `1.5px solid ${selected === p.nama ? C.primary : C.border}`, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: ["#e8f5e9", "#fff8e1", "#e3f2fd", "#fce4ec"][i % 4],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 18,
                      color: C.primary,
                      flexShrink: 0,
                    }}
                  >
                    {p.nama?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{p.nama}</p>
                    <p style={{ fontSize: 12, color: C.muted, opacity: 0.7 }}>{p.janji.length} kunjungan</p>
                  </div>
                  <span style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>{selected === p.nama ? "✕" : "Lihat →"}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail rekam medis */}
        {selected && (
          <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: "22px 24px" }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>📋 Rekam Medis — {selected}</h4>
            {rekamPasien.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", background: C.bg, borderRadius: 16, border: `2px dashed ${C.border}` }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                <p style={{ color: C.muted, fontSize: 13 }}>Belum ada rekam medis tersimpan.</p>
              </div>
            ) : (
              rekamPasien.map((r, i) => (
                <div key={r.id} style={{ background: C.bg, borderRadius: 14, padding: "16px 18px", marginBottom: 12, border: `1px solid ${C.border}40` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>📅 {new Date(r.tanggal_janji).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>#{i + 1}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    {[
                      ["📏 Tinggi", r.tinggi_badan ? `${r.tinggi_badan} cm` : "—"],
                      ["⚖️ Berat", r.berat_badan ? `${r.berat_badan} kg` : "—"],
                      ["🌡️ Suhu", r.suhu ? `${r.suhu} °C` : "—"],
                      ["💓 Tekanan Darah", r.tekanan_darah || "—"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ background: C.white, borderRadius: 10, padding: "9px 12px", border: `1px solid ${C.border}40` }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    ["🔬 Diagnosis", r.diagnosis],
                    ["💊 Resep", r.resep],
                    ["🏥 Tindakan", r.tindakan],
                    ["📝 Catatan untuk Orang Tua", r.catatan],
                  ].map(([k, v]) =>
                    v ? (
                      <div key={k} style={{ background: C.white, borderRadius: 10, padding: "9px 12px", marginBottom: 7, border: `1px solid ${C.border}40` }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{v}</div>
                      </div>
                    ) : null,
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// ─── PAGE: PROFIL ──────────────────────────────────────────────────
function PageProfil({ user, dokterProfile, onEdit }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: C.text }}>Profil Saya</h3>
        <button onClick={onEdit} style={btnPri}>
          ✏️ Edit Profil Medis
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}40` }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.primaryMint, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 24 }}>
              {user?.nama?.charAt(0) || "D"}
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text }}>dr. {user?.nama}</p>
              <p style={{ fontSize: 13, color: C.muted, opacity: 0.75 }}>{dokterProfile?.spesialisasi || "Spesialisasi belum diset"}</p>
            </div>
          </div>
          {[
            { label: "Nama Lengkap", value: user?.nama },
            { label: "Email", value: user?.email || "—" },
            { label: "Peran", value: "Dokter" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: `1px solid ${C.border}20` }}>
              <span style={{ fontSize: 13, color: C.muted }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{row.value || "—"}</span>
            </div>
          ))}
        </div>
        <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.border}`, padding: "24px" }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>Info Medis</h4>
          {[
            { label: "Spesialisasi", value: dokterProfile?.spesialisasi || "—" },
            { label: "Jadwal Praktik", value: dokterProfile?.jadwal_praktik || "—" },
          ].map((row) => (
            <div key={row.label} style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{row.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, background: C.bg, padding: "10px 14px", borderRadius: 12 }}>{row.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────
export default function DashboardDokter() {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [dokterProfile, setDokterProfile] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalRekam, setModalRekam] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [modalProfil, setModalProfil] = useState(false);
  const [rekamMedis, setRekamMedis] = useState([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [janjiRes, userRes] = await Promise.all([api.get("/api/janji-temu"), api.get("/api/auth/me")]);
      setAppointments(janjiRes.data.data || janjiRes.data || []);
      const u = userRes.data?.user || userRes.data;
      setUser(u);
      const rekamRes = await api.get("/api/rekam-medis");
      setRekamMedis(rekamRes.data.data || []);
      if (u?.dokter_id || u?.id) {
        try {
          const dokterRes = await api.get(`/api/dokter/${u.dokter_id || u.id}`);
          setDokterProfile(dokterRes.data.data || dokterRes.data);
        } catch {
          /* optional */
        }
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data. Silakan login kembali.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchAll();
    };

    loadData();
  }, [fetchAll]);

  const openStatus = (appt) => {
    setSelectedAppt(appt);
    setModalStatus(true);
  };
  // Dipanggil dari ModalStatusJanji saat pilih "Selesai"
  const openRekamMedis = (appt) => {
    setSelectedAppt(appt);
    setModalRekam(true);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/api/janji-temu/${id}/status`, { status });
    await fetchAll();
  };

  const saveRekamMedis = async (janjiId, form) => {
    const payload = {
      janji_temu_id: janjiId,
      diagnosis: form.diagnosis,
      tindakan: form.tindakan,
      resep: form.resep,
      catatan: form.catatan_dokter,
      tekanan_darah: form.tekanan_darah,
      berat_badan: form.berat_badan,
      tinggi_badan: form.tinggi_badan,
      suhu: form.suhu,
    };
    await api.post("/api/rekam-medis", payload);
    await api.put(`/api/janji-temu/${janjiId}/status`, { status: "Selesai" });
    await fetchAll();
  };
  const updateProfil = async (form) => {
    await api.put("/api/dokter/profil-saya", form);
    await fetchAll();
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
        <div style={{ width: 44, height: 44, border: `4px solid ${C.primary}20`, borderTopColor: C.primary, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16 }} />
        <p style={{ color: C.primary, fontWeight: 600, fontSize: 14 }}>Menyinkronkan data...</p>
      </div>
    );

  const data = { appointments };

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <PageHome data={data} user={user} onOpenStatus={openStatus} onNavigate={setActiveTab} />;
      case "schedule":
        return <PageJadwal appointments={appointments} onOpenStatus={openStatus} />;
      case "patients":
        return <PagePasien appointments={appointments} rekamMedis={rekamMedis} />;
      case "profile":
        return <PageProfil user={user} dokterProfile={dokterProfile} onEdit={() => setModalProfil(true)} />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700&display=swap');
        
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};font-family:'DM Sans',sans-serif}
        .kc-scroll::-webkit-scrollbar{display:none}
        .kc-scroll{scrollbar-width:none}

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .doctor-sidebar {
            position: fixed;
            left: ${sidebarOpen ? "0" : "-280px"};
            transition: left 0.35s ease;
            z-index: 100;
            box-shadow: 6px 0 25px rgba(0,0,0,0.15);
          }
          .doctor-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
            display: ${sidebarOpen ? "block" : "none"};
          }
        }
      `}</style>

      <ModalStatusJanji open={modalStatus} onClose={() => setModalStatus(false)} appt={selectedAppt} onUpdate={updateStatus} onSelesai={openRekamMedis} />
      <ModalRekamMedis open={modalRekam} onClose={() => setModalRekam(false)} appt={selectedAppt} onSave={saveRekamMedis} />
      <ModalProfilDokter open={modalProfil} onClose={() => setModalProfil(false)} dokter={dokterProfile} onUpdate={updateProfil} />

      <div style={{ display: "flex", minHeight: "100vh", background: C.bg, position: "relative" }}>
        {/* SIDEBAR */}
        {/* SIDEBAR */}
        <aside
          className="doctor-sidebar"
          style={{
            width: 260,
            minHeight: "100vh",
            background: C.white,
            borderRight: `1px solid ${C.border}40`,
            display: "flex",
            flexDirection: "column",
            position: "fixed", // penting
            top: 0,
            left: sidebarOpen ? "0" : "-280px", // kontrol posisi
            height: "100vh",
            zIndex: 100,
            transition: "left 0.4s ease",
            boxShadow: sidebarOpen ? "6px 0 25px rgba(0,0,0,0.15)" : "none",
            overflowY: "auto",
          }}
        >
          {" "}
          <div style={{ padding: "26px 20px 22px", borderBottom: `1px solid ${C.border}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#006036,#1a7a4a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  boxShadow: "0 4px 12px rgba(0,96,54,0.3)",
                  flexShrink: 0,
                }}
              >
                🌿
              </div>
              <div style={{ padding: "26px 20px 22px", borderBottom: `1px solid ${C.border}30` }}>
                {/* logo kids care */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#006036,#1a7a4a)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      boxShadow: "0 4px 12px rgba(0,96,54,0.3)",
                    }}
                  >
                    🌿
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.primary }}>KidsCare</p>
                    <p style={{ fontSize: 10, color: C.muted }}>DOCTOR DASHBOARD</p>
                  </div>
                </div>
              </div>{" "}
            </div>
          </div>
          {/* profile dokter */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.primaryMint, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{user?.nama?.charAt(0) || "D"}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>dr. {user?.nama || "Dokter"}</p>
                <p style={{ fontSize: 11, color: C.muted }}>{dokterProfile?.spesialisasi || "Dokter"}</p>
              </div>
            </div>
          </div>{" "}
          {/* Navigasi */}
          <nav style={{ padding: "14px 12px", flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "10px 14px",
                    borderRadius: 13,
                    border: "none",
                    cursor: "pointer",
                    marginBottom: 3,
                    background: active ? C.primaryLight : "transparent",
                    color: active ? C.primary : C.muted,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <span style={{ fontSize: 17 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>{" "}
          <div style={{ padding: "12px", borderTop: `1px solid ${C.border}30`, display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={fetchAll}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 13,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                background: "transparent",
                color: C.muted,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <span>🔄</span> Refresh Data
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 13, border: "none", cursor: "pointer", background: C.redLight, color: C.red, fontWeight: 700, fontSize: 13 }}
            >
              <span>🚪</span> Keluar
            </button>
          </div>
        </aside>

        {/* OVERLAY */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 99,
            }}
          />
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* HEADER BARU (dengan tombol hamburger) */}
          <header
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(16px)",
              padding: "14px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${C.border}40`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ fontSize: 26, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                ☰
              </button>
              <div>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 1 }}>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.text }}>{NAV_ITEMS.find((n) => n.id === activeTab)?.label || "Dashboard"}</h2>
              </div>
            </div>
            <button style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: C.primaryLight, color: C.primary, fontSize: 18 }}>🔔</button>
          </header>{" "}
          {error && (
            <div style={{ margin: "16px 32px 0", padding: "12px 16px", background: C.redLight, border: `1px solid ${C.red}30`, borderRadius: 14, display: "flex", gap: 10, alignItems: "center" }}>
              <span>⚠️</span>
              <p style={{ color: C.red, fontSize: 13, fontWeight: 600, flex: 1 }}>{error}</p>
              <button onClick={fetchAll} style={{ color: C.red, fontWeight: 700, fontSize: 13, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Retry
              </button>
            </div>
          )}
          <main className="kc-scroll doctor-main" style={{ flex: 1, overflowY: "auto", padding: "28px 32px 40px" }}>
            {renderPage()}
          </main>{" "}
        </div>
      </div>
    </>
  );
}
