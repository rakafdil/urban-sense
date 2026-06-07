import { useState } from "react";
import {
  Plus,
  Bell,
  Star,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  MapPin,
  Calendar,
  Loader2,
  Image as ImageIcon,
  Navigation,
} from "lucide-react";
import ReportForm from "./ReportForm";
import { StatusBadge } from "./StatusBadge";
import { apiClient } from "@/lib/axios";
import { Report } from "@/app/types/report.type";
import { MOCK_USER, userApiService } from "@/app/services/user.service";
import ImageViewer from "./ImageViewer";
import { useUserMe } from "@/app/hooks/useUserMe";
import { useMyReports } from "@/app/hooks/report/useMyReports";

export const CATEGORIES: Record<string, { label: string; icon: string }> = {
  road_damage: { label: "Jalan Rusak", icon: "🛣️" },
  flood: { label: "Banjir", icon: "🌊" },
  garbage: { label: "Sampah", icon: "🗑️" },
  street_light: { label: "Lampu Jalan", icon: "💡" },
  drainage: { label: "Drainase", icon: "🚰" },
  social_assistance: { label: "Bansos", icon: "📦" },
  environment: { label: "Lingkungan", icon: "🌳" },
  other: { label: "Lainnya", icon: "📝" },
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  open: { label: "Menunggu", color: "#64748B", bg: "#1E293B" },
  in_progress: { label: "Diproses", color: "#3B82F6", bg: "#DBEAFE" },
  resolved: { label: "Selesai", color: "#10B981", bg: "#D1FAE5" },
  closed: { label: "Ditutup", color: "#64748B", bg: "#1E293B" },
  // Backward compatibility untuk mock
  dilaporkan: { label: "Menunggu", color: "#64748B", bg: "#1E293B" },
  diverifikasi: { label: "Diverifikasi", color: "#F59E0B", bg: "#FEF3C7" },
  dalam_penanganan: { label: "Diproses", color: "#3B82F6", bg: "#DBEAFE" },
  selesai: { label: "Selesai", color: "#10B981", bg: "#D1FAE5" },
};

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type Tab = "laporan" | "profil";

export function WargaDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("laporan");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: userData, isLoading: isLoadingUser } = useUserMe();
  const { data: reportsData = [], isLoading: isLoadingReports } =
    useMyReports();

  const userName = userData?.fullName || "Warga";
  const points = userData?.totalPoints || 0;
  const reports = Array.isArray(reportsData) ? reportsData : [];

  const myStats = [
    {
      label: "Total Laporan",
      value: reports.length,
      icon: <AlertCircle size={15} />,
      color: "#3B82F6",
    },
    {
      label: "Selesai",
      value: reports.filter(
        (r) => r.status === "selesai" || r.status === "resolved",
      ).length,
      icon: <CheckCircle size={15} />,
      color: "#10B981",
    },
    {
      label: "Diproses",
      value: reports.filter(
        (r) => r.status === "dalam_penanganan" || r.status === "in_progress",
      ).length,
      icon: <Clock size={15} />,
      color: "#F59E0B",
    },
    {
      label: "Total Poin",
      value: points,
      icon: <Star size={15} />,
      color: "#8B5CF6",
    },
  ];

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0F172A] text-slate-400 flex-col gap-3">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-sm font-medium tracking-wide">
          Menghubungkan ke API...
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden font-sans text-slate-200 selection:bg-blue-500/30"
      style={{ background: "#0F172A" }}
    >
      <div
        className="px-4 sm:px-8 pt-6 pb-5 border-b border-slate-800 flex-shrink-0"
        style={{ background: "#1E293B" }}
      >
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate tracking-tight">
              Hai, {userName.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 hidden sm:block">
              Pantau dan kelola laporan Anda secara terpusat.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors relative bg-[#0F172A]">
              <Bell size={18} className="text-slate-400" />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Lapor Sekarang</span>
              <span className="sm:hidden">Lapor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {myStats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 sm:p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5 bg-[#0F172A] hover:border-slate-700 transition-colors"
            >
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                style={{ background: `${s.color}15`, color: s.color }}
              >
                {s.icon}
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-white leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1 font-medium">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mt-5 lg:hidden p-1 border border-slate-800 rounded-xl bg-[#0F172A]">
          {(["laporan", "profil"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-all rounded-lg capitalize ${
                activeTab === t
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "laporan" ? "📋 Daftar Laporan" : "🏅 Gamifikasi"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden relative w-full">
        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 ${activeTab !== "laporan" ? "hidden lg:block" : ""}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Riwayat Laporan
            </h2>
          </div>

          {isLoadingReports ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-slate-500" size={32} />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
              <p className="text-slate-400 text-sm">
                Belum ada laporan yang Anda buat.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Buat laporan pertama
              </button>
            </div>
          ) : (
            reports.map((r: Report) => {
              const isSelected = selectedReportId === r.id;
              const cat = CATEGORIES[r.category] || CATEGORIES.other;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReportId(isSelected ? null : r.id)}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-500/50 bg-blue-900/10 shadow-lg shadow-blue-900/5"
                      : "border-slate-800 bg-[#1E293B] hover:border-slate-700 hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {cat.label}
                        </span>
                        <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {new Date(r.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-white leading-snug truncate">
                        {r.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 truncate">
                        <MapPin
                          size={12}
                          className="flex-shrink-0 text-slate-500"
                        />
                        <span className="truncate">
                          {r.address || "Lokasi tidak spesifik"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <StatusBadge status={r.status} />
                      {r.upvoteCount !== undefined && (
                        <div className="text-[10px] font-medium bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <TrendingUp size={10} /> {r.upvoteCount} Dukungan
                        </div>
                      )}
                      <ChevronRight
                        size={18}
                        className={`text-slate-500 transition-transform duration-300 ${isSelected ? "rotate-90" : ""}`}
                      />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-5 pt-5 border-t border-slate-700/50 space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                      {r.photoUrl && (
                        <div className="relative group">
                          <img
                            src={r.photoUrl}
                            alt={r.title}
                            className="w-full h-48 sm:h-64 object-cover rounded-xl border border-slate-700 cursor-pointer transition-all group-hover:brightness-75"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightbox(r.photoUrl!);
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                            <span className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
                              Perbesar Foto
                            </span>
                          </div>
                        </div>
                      )}

                      {r.aiSummary && (
                        <div className="bg-blue-900/20 p-3 rounded-xl border border-blue-500/20 flex gap-2">
                          <div className="text-xl">🤖</div>
                          <div>
                            <h4 className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
                              AI Summary
                            </h4>
                            <p className="text-xs text-blue-200 leading-relaxed italic">
                              "{r.aiSummary}"
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Detail Kejadian
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {r.description}
                        </p>
                        {r.latitude && r.longitude && (
                          <div className="mt-3 pt-3 border-t border-slate-700/50 flex gap-2 items-center text-xs text-slate-400 font-mono">
                            <Navigation size={12} /> Koordinat GPS: {r.latitude}
                            , {r.longitude}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div
          className={`overflow-y-auto lg:w-80 lg:border-l lg:border-slate-800 lg:flex-shrink-0 bg-[#162032] ${activeTab === "profil" ? "flex-1" : "hidden lg:block"}`}
        >
          <div className="p-5 sm:p-6 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Profil Anda
            </h3>
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg border-2 border-slate-700"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                }}
              >
                {userName.charAt(0)}
              </div>
              <div>
                <div className="text-base text-white font-bold">{userName}</div>
                <div className="text-xs text-blue-400 font-medium bg-blue-500/10 inline-block px-2 py-0.5 rounded-full mt-1 border border-blue-500/20">
                  {userData?.level || MOCK_USER.level}
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 border border-slate-700 bg-[#0F172A] shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Total Poin
                </span>
                <span className="flex items-center gap-1.5 text-base font-bold text-amber-500">
                  <Star size={16} className="fill-amber-500" /> {points}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                  style={{ width: `${(points % 500) / 5}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Koleksi Badge
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(userData?.badges || MOCK_USER.badges || []).map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl p-3 border border-slate-700 text-center bg-slate-800/30 hover:bg-slate-800 transition-colors group cursor-default"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {b.icon}
                  </div>
                  <div className="text-xs text-white font-bold mb-1">
                    {b.name}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <ReportForm
          onClose={() => setShowForm(false)}
          onSubmitSuccess={() => setShowForm(false)}
        />
      )}

      {lightbox && (
        <ImageViewer
          src={lightbox}
          alt="Preview Foto Laporan"
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
