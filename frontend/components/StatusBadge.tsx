import { ReportStatus, STATUS_CONFIG } from "./WargaDashboard";

interface StatusBadgeProps {
  status: ReportStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const px = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono font-medium tracking-wide ${px}`}
      style={{ color: config.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: config.color }}
      />
      {config.label}
    </span>
  );
}
