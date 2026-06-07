"use client";

import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MOCK_REPORTS,
  STATUS_CONFIG,
  CATEGORIES,
  Report,
} from "@/components/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { X } from "lucide-react";
import ImageViewer from "@/components/ImageViewer";

type ReportWithCoords = Report & { lat: number; lng: number };

// Perbaiki ikon Leaflet (wajib)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Konversi mapX/mapY ke latitude/longitude
function mapXYtoLatLng(x: number, y: number): [number, number] {
  const minLat = -6.35;
  const maxLat = -6.1;
  const minLng = 106.7;
  const maxLng = 106.95;
  const lat = maxLat - (y / 100) * (maxLat - minLat);
  const lng = minLng + (x / 100) * (maxLng - minLng);
  return [lat, lng];
}

// Komponen marker
function Markers({
  reports,
  onSelect,
}: {
  reports: ReportWithCoords[];
  onSelect: (r: ReportWithCoords) => void;
}) {
  return (
    <>
      {reports.map((r) => {
        const color = STATUS_CONFIG[r.status]?.color || "#999";
        const icon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        return (
          <Marker
            key={r.id}
            position={[r.lat!, r.lng!]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(r) }}
          >
            <Popup>
              <div style={{ fontSize: 13 }}>
                <strong>{r.title}</strong>
                <br />
                <span style={{ color: "#666" }}>
                  {CATEGORIES[r.category]?.label}
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

// Sidebar detail
function DetailSidebar({
  report,
  onClose,
  onImageClick,
}: {
  report: Report;
  onClose: () => void;
  onImageClick: (src: string) => void;
}) {
  const statuses = [
    "open",
    "dilaporkan",
    "in_progress",
    "dalam_penanganan",
    "diverifikasi",
    "resolved",
    "selesai",
    "rejected",
  ] as const;
  const currentIdx = statuses.indexOf(report.status);

  return (
    <>
      {/* Overlay mobile */}
      <div
        className="fixed inset-0 z-40 md:hidden bg-black/50"
        onClick={onClose}
      />
      {/* Sidebar / bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl md:static md:rounded-none md:w-80 md:border-l md:border-border overflow-y-auto flex-shrink-0 max-h-[80vh] md:max-h-full"
        style={{ background: "#1E293B" }}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div
            className="w-8 h-1 rounded-full"
            style={{ background: "#334155" }}
          />
        </div>

        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Detail Laporan
          </span>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{CATEGORIES[report.category]?.icon}</span>
            <div>
              <div className="text-xs text-muted-foreground">
                {CATEGORIES[report.category]?.label}
              </div>
              <div className="font-mono text-xs" style={{ color: "#64748B" }}>
                #{String(report.id).padStart(4, "0")}
              </div>
            </div>
          </div>

          <h3 className="text-sm text-foreground leading-snug">
            {report.title}
          </h3>
          <StatusBadge status={report.status} />

          {report.imageUrl && (
            <img
              src={report.imageUrl}
              alt={report.title}
              className="w-full h-36 object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(report.imageUrl!)}
            />
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            {report.description}
          </p>

          <div className="space-y-2 text-xs border-t border-border pt-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lokasi</span>
              <span className="text-foreground">{report.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pelapor</span>
              <span className="text-foreground">{report.reporter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tanggal</span>
              <span className="text-foreground">{report.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dukungan</span>
              <span className="text-foreground">{report.upvotes} warga</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-border pt-3">
            <div className="text-xs text-muted-foreground mb-2">
              Riwayat Status
            </div>
            <div className="space-y-2">
              {statuses.map((s, i) => {
                const isReached = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: isReached
                          ? STATUS_CONFIG[s].color
                          : "#334155",
                      }}
                    />
                    <span
                      className={`text-xs ${
                        isCurrent
                          ? "text-foreground font-medium"
                          : isReached
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {STATUS_CONFIG[s].label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Komponen utama
export default function MapClient() {
  const [selected, setSelected] = useState<Report | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null); // ← state ImageViewer

  const reportsWithCoords = useMemo<ReportWithCoords[]>(() => {
    return MOCK_REPORTS.map((r) => {
      if ((r as any).latitude != null && (r as any).longitude != null) {
        return { ...r, lat: (r as any).latitude, lng: (r as any).longitude };
      }
      const [lat, lng] = mapXYtoLatLng(r.mapX, r.mapY);
      return { ...r, lat, lng };
    });
  }, []);

  return (
    <div className="flex h-full w-full">
      {/* Container peta */}
      <div className="flex-1 relative">
        <MapContainer
          center={[-6.2, 106.8]}
          zoom={13}
          style={{ height: "100%", width: "100%", background: "#0F172A" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Markers reports={reportsWithCoords} onSelect={setSelected} />
        </MapContainer>

        {/* Legend */}
        <div
          className="absolute bottom-4 left-4 rounded-lg p-2.5 border border-border text-xs space-y-1.5 z-[1000]"
          style={{
            background: "rgba(15,23,42,0.92)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="text-muted-foreground mb-1 font-mono text-[10px]">
            LEGENDA
          </div>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: config.color }}
              />
              <span className="text-foreground text-[10px] sm:text-xs">
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar detail */}
      {selected && (
        <DetailSidebar
          report={selected}
          onClose={() => setSelected(null)}
          onImageClick={(src) => setLightbox(src)}
        />
      )}

      {/* Image lightbox */}
      {lightbox && (
        <ImageViewer
          src={lightbox}
          alt="Gambar Laporan"
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
