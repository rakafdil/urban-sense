export type ReportCategory =
  | "road_damage"
  | "flood"
  | "garbage"
  | "street_light"
  | "drainage"
  | "social_assistance"
  | "environment"
  | "other";
export type ReportStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "dilaporkan"
  | "diverifikasi"
  | "dalam_penanganan"
  | "selesai";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  address?: string;
  latitude?: string;
  longitude?: string;
  photoUrl?: string; // Berubah dari photo menjadi photoUrl sesuai response backend
  createdAt: string;
  upvoteCount?: number;
  aiSummary?: string;
}