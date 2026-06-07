import { MapPin, Users, BarChart2, Bell, Shield, Zap, ChevronRight, Globe } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const STATS = [
  { value: "12,450", label: "Laporan Diterima", color: "#3B82F6" },
  { value: "89%", label: "Tingkat Penyelesaian", color: "#10B981" },
  { value: "34", label: "Kelurahan Terlayani", color: "#06B6D4" },
  { value: "5,820", label: "Warga Aktif", color: "#8B5CF6" },
];

const FEATURES = [
  {
    icon: <MapPin size={20} />,
    title: "Peta Interaktif Real-time",
    desc: "Lihat seluruh laporan di peta dengan marker berwarna sesuai status dan kategori masalah.",
    color: "#3B82F6",
  },
  {
    icon: <Zap size={20} />,
    title: "AI Auto-Kategorisasi",
    desc: "Upload foto dan biarkan AI mendeteksi kategori dan deskripsi masalah secara otomatis.",
    color: "#8B5CF6",
  },
  {
    icon: <Bell size={20} />,
    title: "Notifikasi Status Update",
    desc: "Terima pemberitahuan langsung saat status laporan Anda berubah tanpa perlu cek manual.",
    color: "#06B6D4",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "Dashboard Analytics",
    desc: "Heat map intensitas masalah per kelurahan dan grafik laporan harian untuk admin.",
    color: "#10B981",
  },
  {
    icon: <Users size={20} />,
    title: "Komunitas & Gamifikasi",
    desc: "Kumpulkan poin dan badge untuk setiap laporan yang diverifikasi. Jadilah warga teladan.",
    color: "#F59E0B",
  },
  {
    icon: <Shield size={20} />,
    title: "Terkoneksi ke Pemerintah",
    desc: "Laporan langsung masuk ke dashboard petugas kelurahan untuk penanganan yang cepat.",
    color: "#EF4444",
  },
];

const PERSONAS = [
  {
    initials: "BW",
    name: "Budi, Warga",
    desc: "Melaporkan jalan berlubang di depan rumahnya lewat HP, ingin tahu kapan diperbaiki.",
    color: "#3B82F6",
  },
  {
    initials: "SA",
    name: "Sari, Petugas Kelurahan",
    desc: "Memantau laporan masuk, menugaskan tim teknis, dan mengupdate status pekerjaan.",
    color: "#10B981",
  },
  {
    initials: "RV",
    name: "Rizky, Relawan",
    desc: "Menerima notifikasi masalah di sekitar lokasi dan membantu validasi laporan di lapangan.",
    color: "#8B5CF6",
  },
];

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen" style={{ background: "#0F172A" }}>
      {/* Navbar */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-40" style={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}>
            <Globe size={16} className="text-white" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">UrbanSense</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a>
          <a href="#cara-kerja" className="hover:text-foreground transition-colors">Cara Kerja</a>
          <a href="#sdgs" className="hover:text-foreground transition-colors">SDGs</a>
        </div>
        <button
          onClick={onGetStarted}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: "#3B82F6", color: "#fff" }}
        >
          Mulai Sekarang <ChevronRight size={14} />
        </button>
      </nav>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(ellipse, #3B82F6, transparent 70%)" }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground mb-6" style={{ background: "rgba(59,130,246,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10B981" }} />
            SDGs #3 · #10 · #11 — Kota Inklusif & Cerdas
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
            Kota yang Lebih Baik<br />
            <span style={{ background: "linear-gradient(90deg, #3B82F6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Dimulai dari Laporan Anda
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Platform pelaporan komunitas berbasis AI yang menghubungkan warga, relawan, dan pemerintah lokal untuk mempercepat penanganan masalah infrastruktur dan kesejahteraan sosial.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", color: "#fff" }}
            >
              <MapPin size={16} /> Laporkan Masalah
            </button>
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <BarChart2 size={16} /> Lihat Peta Laporan
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border" style={{ background: "rgba(30,41,59,0.5)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Semua yang Dibutuhkan Kota Anda</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Fitur lengkap dari pelaporan hingga analitik untuk ekosistem kota yang responsif.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl p-5 border border-border hover:border-primary/30 transition-colors group" style={{ background: "#1E293B" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${f.color}20`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section id="cara-kerja" className="border-t border-border" style={{ background: "rgba(30,41,59,0.3)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Untuk Siapa UrbanSense?</h2>
            <p className="text-muted-foreground">Tiga peran, satu tujuan: kota yang lebih responsif dan inklusif.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {PERSONAS.map((p) => (
              <div key={p.name} className="rounded-xl p-6 border border-border text-center" style={{ background: "#1E293B" }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white mx-auto mb-4"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}88)` }}
                >
                  {p.initials}
                </div>
                <h3 className="text-foreground mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDGs Banner */}
      <section id="sdgs" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="rounded-2xl p-8 border border-border" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.05))" }}>
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="flex gap-3">
              {["#3", "#10", "#11"].map((sdg) => (
                <div key={sdg} className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold border border-border" style={{ background: "#1E293B" }}>
                  {sdg}
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-foreground mb-1">Berkontribusi pada Sustainable Development Goals</h3>
              <p className="text-sm text-muted-foreground">
                UrbanSense mendukung <strong className="text-foreground">SDG #3</strong> (Kesehatan), <strong className="text-foreground">#10</strong> (Berkurangnya Kesenjangan), dan <strong className="text-foreground">#11</strong> (Kota & Komunitas Berkelanjutan).
              </p>
            </div>
            <button
              onClick={onGetStarted}
              className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: "#3B82F6", color: "#fff" }}
            >
              Coba Sekarang →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}>
            <Globe size={10} className="text-white" />
          </div>
          <span className="font-medium text-foreground">UrbanSense</span>
        </div>
        <p>Platform Pelaporan Kota Inklusif & Cerdas · Hackathon 2026</p>
      </footer>
    </div>
  );
}
