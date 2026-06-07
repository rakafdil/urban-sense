import { useState } from "react";
import { BarChart2, CheckCircle, Clock, AlertTriangle, TrendingUp, Filter, Eye, ChevronDown, ChevronUp, X, Download, ChevronRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { MOCK_REPORTS, WEEKLY_DATA, CATEGORY_DATA, STATUS_CONFIG, CATEGORIES, Report, ReportStatus } from "@/components/mockData";
import { StatusBadge } from "@/components/StatusBadge";

export function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [sortField, setSortField] = useState<"date" | "upvotes">("date");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const filtered = reports
    .filter(r => filterStatus === "all" || r.status === filterStatus)
    .filter(r => filterCategory === "all" || r.category === filterCategory)
    .sort((a, b) => {
      if (sortField === "date") return sortDir === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
      return sortDir === "desc" ? b.upvotes - a.upvotes : a.upvotes - b.upvotes;
    });

  const statusCounts = {
    dilaporkan: reports.filter(r => r.status === "dilaporkan").length,
    diverifikasi: reports.filter(r => r.status === "diverifikasi").length,
    dalam_penanganan: reports.filter(r => r.status === "dalam_penanganan").length,
    selesai: reports.filter(r => r.status === "selesai").length,
  };

  const handleStatusChange = (reportId: number, newStatus: ReportStatus) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus, updatedAt: "2026-06-07" } : r));
    if (selectedReport?.id === reportId) {
      setSelectedReport(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const statusFlow: ReportStatus[] = ["dilaporkan", "diverifikasi", "dalam_penanganan", "selesai"];

  const getNextStatus = (current: ReportStatus): ReportStatus | null => {
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const STAT_CARDS = [
    { label: "Total Laporan", value: reports.length + 122, sub: "+12 hari ini", icon: <BarChart2 size={18} />, color: "#3B82F6" },
    { label: "Penanganan", value: statusCounts.dalam_penanganan + statusCounts.diverifikasi + 28, sub: "on-going", icon: <Clock size={18} />, color: "#F59E0B" },
    { label: "Selesai", value: statusCounts.selesai + 87, sub: "resolved", icon: <CheckCircle size={18} />, color: "#10B981" },
    { label: "Belum Direspons", value: statusCounts.dilaporkan + 18, sub: "perlu tindak lanjut", icon: <AlertTriangle size={18} />, color: "#EF4444" },
  ];

  return (
    <div className="relative flex h-full min-h-0 overflow-hidden" style={{ background: "#0F172A" }}>
      {/* Main scroll area */}
      <div className="flex-1 overflow-y-auto min-w-0">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-border sticky top-0 z-10" style={{ background: "#1E293B" }}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-foreground truncate">Dashboard Admin</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Kelurahan Menteng · Jakarta Pusat</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground font-mono hidden sm:block">7 Jun 2026</span>
              <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs border border-border text-muted-foreground hover:text-foreground transition-colors">
                <Download size={12} /> <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Stat cards — 2-col on mobile, 4-col on xl */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="rounded-xl p-3 sm:p-4 border border-border" style={{ background: "#1E293B" }}>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
                    {s.icon}
                  </div>
                  <TrendingUp size={12} style={{ color: "#10B981" }} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground leading-none mb-1">{s.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{s.label}</div>
                <div className="text-xs mt-1 font-mono" style={{ color: s.color }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Charts — stacked on mobile, side by side on md */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-xl p-4 sm:p-5 border border-border" style={{ background: "#1E293B" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-foreground">Laporan 7 Hari Terakhir</h3>
                <span className="text-xs text-muted-foreground font-mono hidden sm:block">1–7 Jun 2026</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={WEEKLY_DATA} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip
                    contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                    labelStyle={{ color: "#E2E8F0" }}
                  />
                  <Bar dataKey="laporan" name="Masuk" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="selesai" name="Selesai" fill="#10B981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#3B82F6" }} /> Masuk
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#10B981" }} /> Selesai
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 sm:p-5 border border-border" style={{ background: "#1E293B" }}>
              <h3 className="text-sm text-foreground mb-3">Kategori Masalah</h3>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                    {CATEGORY_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {CATEGORY_DATA.slice(0, 4).map(c => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.color }} />
                      <span className="text-muted-foreground">{c.name}</span>
                    </div>
                    <span className="font-mono text-foreground">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reports — table on md+, cards on mobile */}
          <div className="rounded-xl border border-border overflow-hidden" style={{ background: "#1E293B" }}>
            {/* Toolbar */}
            <div className="px-4 sm:px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm text-foreground flex items-center gap-2">
                  <Filter size={13} style={{ color: "#3B82F6" }} /> Semua Laporan
                </h3>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="text-xs border border-border rounded-lg px-2 py-1.5 text-foreground outline-none"
                    style={{ background: "#0F172A" }}
                  >
                    <option value="all">Semua Status</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="text-xs border border-border rounded-lg px-2 py-1.5 text-foreground outline-none"
                    style={{ background: "#0F172A" }}
                  >
                    <option value="all">Semua Kategori</option>
                    {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <span className="text-xs text-muted-foreground font-mono">{filtered.length}</span>
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground text-left">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Laporan</th>
                    <th className="px-4 py-3 font-medium">Kategori</th>
                    <th className="px-4 py-3 font-medium">Lokasi</th>
                    <th
                      className="px-4 py-3 font-medium cursor-pointer hover:text-foreground"
                      onClick={() => { setSortField("date"); setSortDir(d => d === "desc" ? "asc" : "desc"); }}
                    >
                      <span className="flex items-center gap-1">
                        Tanggal {sortField === "date" ? (sortDir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : null}
                      </span>
                    </th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const next = getNextStatus(r.status);
                    return (
                      <tr key={r.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{String(r.id).padStart(4, "0")}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="text-sm text-foreground leading-snug truncate">{r.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{r.reporter}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {CATEGORIES[r.category].icon} {CATEGORIES[r.category].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.location}</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{r.date}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} size="sm" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReport(selectedReport?.id === r.id ? null : r)}
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                              <Eye size={12} />
                            </button>
                            {next && (
                              <button
                                onClick={() => handleStatusChange(r.id, next)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
                                style={{ background: `${STATUS_CONFIG[next].color}20`, color: STATUS_CONFIG[next].color }}
                              >
                                → {STATUS_CONFIG[next].label}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map(r => {
                const next = getNextStatus(r.status);
                const isOpen = selectedReport?.id === r.id;
                return (
                  <div key={r.id} className="p-4" style={{ background: isOpen ? "rgba(59,130,246,0.04)" : "transparent" }}>
                    <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setSelectedReport(isOpen ? null : r)}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{CATEGORIES[r.category].icon}</span>
                          <span className="text-xs text-muted-foreground">{CATEGORIES[r.category].label}</span>
                          <span className="font-mono text-xs text-muted-foreground ml-auto">#{String(r.id).padStart(4, "0")}</span>
                        </div>
                        <p className="text-sm text-foreground leading-snug">{r.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <StatusBadge status={r.status} size="sm" />
                          <span className="text-xs text-muted-foreground">{r.date}</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className={`text-muted-foreground flex-shrink-0 mt-1 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-border space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                        <div className="text-xs text-muted-foreground">
                          <span className="text-foreground">{r.reporter}</span> · {r.location} · {r.upvotes} dukungan
                        </div>
                        {next && (
                          <button
                            onClick={() => handleStatusChange(r.id, next)}
                            className="w-full py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                            style={{ background: `${STATUS_CONFIG[next].color}20`, color: STATUS_CONFIG[next].color }}
                          >
                            Majukan ke: {STATUS_CONFIG[next].label}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detail side panel — fixed overlay on mobile, sidebar on lg */}
      {selectedReport && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedReport(null)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl lg:static lg:rounded-none lg:w-80 lg:border-l lg:border-border overflow-y-auto flex-shrink-0 max-h-[85vh] lg:max-h-none"
            style={{ background: "#1E293B" }}
          >
            {/* Handle bar on mobile */}
            <div className="flex justify-center pt-3 pb-1 lg:hidden">
              <div className="w-8 h-1 rounded-full" style={{ background: "#334155" }} />
            </div>

            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Detail Laporan</span>
              <button onClick={() => setSelectedReport(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CATEGORIES[selectedReport.category].icon}</span>
                <div>
                  <div className="text-xs text-muted-foreground">{CATEGORIES[selectedReport.category].label}</div>
                  <div className="font-mono text-xs" style={{ color: "#64748B" }}>#{String(selectedReport.id).padStart(4, "0")}</div>
                </div>
              </div>

              <h3 className="text-sm text-foreground leading-snug">{selectedReport.title}</h3>
              <StatusBadge status={selectedReport.status} />

              {selectedReport.imageUrl && (
                <img src={selectedReport.imageUrl} alt={selectedReport.title} className="w-full h-36 object-cover rounded-lg border border-border" />
              )}

              <p className="text-xs text-muted-foreground leading-relaxed">{selectedReport.description}</p>

              <div className="space-y-2 text-xs border-t border-border pt-3">
                {[
                  ["Lokasi", selectedReport.address],
                  ["Pelapor", selectedReport.reporter],
                  ["Tanggal", selectedReport.date],
                  ["Dukungan", `${selectedReport.upvotes} warga`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-muted-foreground flex-shrink-0">{k}</span>
                    <span className="text-foreground text-right">{v}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground mb-3">Ubah Status</div>
                <div className="grid grid-cols-2 gap-2">
                  {statusFlow.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedReport.id, s)}
                      className="py-2 px-3 rounded-lg text-xs font-medium border transition-all"
                      style={{
                        background: selectedReport.status === s ? `${STATUS_CONFIG[s].color}20` : "transparent",
                        borderColor: selectedReport.status === s ? STATUS_CONFIG[s].color : "rgba(255,255,255,0.08)",
                        color: selectedReport.status === s ? STATUS_CONFIG[s].color : "#64748B",
                      }}
                    >
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pb-2 lg:pb-0" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
