export type ReportStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "dilaporkan"
  | "diverifikasi"
  | "dalam_penanganan"
  | "selesai";
export type ReportCategory = "jalan_rusak" | "banjir" | "sampah" | "infrastruktur" | "sosial" | "pencemaran";

export interface Report {
  id: number;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  location: string;
  address: string;
  date: string;
  reporter: string;
  reporterId: number;
  mapX: number;
  mapY: number;
  latitude?: number;
  longitude?: number;
  upvotes: number;
  imageUrl?: string;
  updatedAt: string;
}

export const CATEGORIES: Record<ReportCategory, { label: string; icon: string; color: string }> = {
  jalan_rusak: { label: "Jalan Rusak", icon: "🚧", color: "#F59E0B" },
  banjir: { label: "Banjir", icon: "🌊", color: "#3B82F6" },
  sampah: { label: "Sampah", icon: "🗑️", color: "#10B981" },
  infrastruktur: { label: "Infrastruktur", icon: "🔧", color: "#8B5CF6" },
  sosial: { label: "Sosial", icon: "🤝", color: "#EC4899" },
  pencemaran: { label: "Pencemaran", icon: "☣️", color: "#EF4444" },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  // Status dari backend (Prisma)
  open:         { label: "Terbuka",       color: "#EF4444" },
  in_progress:  { label: "Diproses",      color: "#F59E0B" },
  resolved:     { label: "Selesai",       color: "#10B981" },
  rejected:     { label: "Ditolak",       color: "#6B7280" },
  
  // Status dari mock data awal (jika masih dipakai)
  dilaporkan:   { label: "Dilaporkan",    color: "#3B82F6" },
  dalam_penanganan: { label: "Dalam Penanganan", color: "#8B5CF6" },
  diverifikasi: { label: "Diverifikasi",  color: "#06B6D4" },
  selesai:      { label: "Selesai",       color: "#10B981" },
};
export const MOCK_REPORTS: Report[] = [
  {
    id: 1,
    title: "Jalan berlubang besar di Jl. Sudirman",
    description:
      "Terdapat lubang besar sedalam ±30cm di badan jalan, sangat berbahaya terutama malam hari. Sudah terjadi beberapa kali kecelakaan motor.",
    category: "jalan_rusak",
    status: "in_progress",
    location: "Kel. Menteng",
    address: "Jl. Jend. Sudirman No. 45",
    date: "2026-06-05",
    updatedAt: "2026-06-06",
    reporter: "Budi Santoso",
    reporterId: 1,
    mapX: 42,
    mapY: 33,
    latitude: -6.2088,
    longitude: 106.8456,
    upvotes: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&auto=format",
  },
  {
    id: 2,
    title: "Banjir setinggi lutut di Gang Mawar",
    description:
      "Setiap hujan lebat, wilayah ini selalu tergenang minimal 2 jam. Drainase utama sudah penuh sedimen.",
    category: "banjir",
    status: "open",
    location: "Kel. Cikini",
    address: "Gang Mawar RT 03/RW 07",
    date: "2026-06-06",
    updatedAt: "2026-06-06",
    reporter: "Rina Kusuma",
    reporterId: 2,
    mapX: 62,
    mapY: 50,
    latitude: -6.1952,
    longitude: 106.823,
    upvotes: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=250&fit=crop&auto=format",
  },
  {
    id: 3,
    title: "Tumpukan sampah di TPS liar",
    description:
      "Ada TPS liar yang terbentuk di pinggir jalan. Sudah 2 minggu tidak diangkut. Mulai menimbulkan bau dan vektor penyakit.",
    category: "sampah",
    status: "selesai",
    location: "Kel. Gondangdia",
    address: "Jl. Kebon Sirih Barat No. 12",
    date: "2026-06-04",
    updatedAt: "2026-06-07",
    reporter: "Ahmad Fauzi",
    reporterId: 3,
    mapX: 28,
    mapY: 62,
    latitude: -6.2008,
    longitude: 106.832,
    upvotes: 31,
    imageUrl:
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=250&fit=crop&auto=format",
  },
  {
    id: 4,
    title: "Lampu jalan padam 3 titik",
    description:
      "Tiga titik lampu PJU di sepanjang Jl. Wahid Hasyim mati sejak seminggu lalu. Sangat rawan kejahatan dan kecelakaan malam hari.",
    category: "infrastruktur",
    status: "diverifikasi",
    location: "Kel. Menteng",
    address: "Jl. Wahid Hasyim (depan No. 88-102)",
    date: "2026-06-06",
    updatedAt: "2026-06-07",
    reporter: "Siti Maulida",
    reporterId: 4,
    mapX: 76,
    mapY: 24,
    latitude: -6.1865,
    longitude: 106.8342,
    upvotes: 12,
  },
  {
    id: 5,
    title: "Warga lansia isolasi butuh bantuan pangan",
    description:
      "Ibu Suharti (76th) tinggal sendiri, tidak ada keluarga. Kesulitan mendapat akses kebutuhan dasar sejak sakit.",
    category: "sosial",
    status: "selesai",
    location: "Kel. Pegangsaan",
    address: "Jl. Pegangsaan Timur No. 7",
    date: "2026-06-03",
    updatedAt: "2026-06-05",
    reporter: "Dewi Purnama",
    reporterId: 5,
    mapX: 55,
    mapY: 72,
    latitude: -6.2103,
    longitude: 106.8509,
    upvotes: 45,
  },
  {
    id: 6,
    title: "Drainase tersumbat di Komplek Menteng Atas",
    description:
      "Saluran drainase 200m tersumbat sampah dan sedimen. Mengakibatkan air melimpah ke jalan saat hujan.",
    category: "banjir",
    status: "dalam_penanganan",
    location: "Kel. Cikini",
    address: "Jl. Menteng Atas No. 30",
    date: "2026-06-07",
    updatedAt: "2026-06-07",
    reporter: "Rizky Aditya",
    reporterId: 6,
    mapX: 38,
    mapY: 46,
    latitude: -6.1957,
    longitude: 106.8354,
    upvotes: 9,
  },
  {
    id: 7,
    title: "Pencemaran sungai oleh limbah industri",
    description:
      "Warna air kali berubah hitam dan berbau. Ikan-ikan mati. Diduga dari pembuangan limbah industri tanpa treatment.",
    category: "pencemaran",
    status: "diverifikasi",
    location: "Kel. Rawasari",
    address: "Kali Ciliwung RT 05/RW 02",
    date: "2026-06-05",
    updatedAt: "2026-06-06",
    reporter: "Hendro Wijaya",
    reporterId: 7,
    mapX: 82,
    mapY: 58,
    latitude: -6.1924,
    longitude: 106.8612,
    upvotes: 38,
  },
  {
    id: 8,
    title: "Jembatan pejalan kaki retak parah",
    description:
      "Jembatan penyeberangan orang (JPO) menunjukkan retak struktur di tiang penyangga. Berbahaya bagi pengguna.",
    category: "infrastruktur",
    status: "dilaporkan",
    location: "Kel. Menteng",
    address: "JPO depan Sarinah Thamrin",
    date: "2026-06-07",
    updatedAt: "2026-06-07",
    reporter: "Budi Santoso",
    reporterId: 1,
    mapX: 50,
    mapY: 18,
    latitude: -6.1862,
    longitude: 106.8235,
    upvotes: 52,
  },
];

export const WEEKLY_DATA = [
  { day: "Sen", laporan: 8, selesai: 3 },
  { day: "Sel", laporan: 14, selesai: 7 },
  { day: "Rab", laporan: 11, selesai: 9 },
  { day: "Kam", laporan: 19, selesai: 11 },
  { day: "Jum", laporan: 22, selesai: 14 },
  { day: "Sab", laporan: 16, selesai: 8 },
  { day: "Min", laporan: 12, selesai: 5 },
];

export const CATEGORY_DATA = [
  { name: "Jalan Rusak", value: 34, color: "#F59E0B" },
  { name: "Banjir", value: 28, color: "#3B82F6" },
  { name: "Sampah", value: 22, color: "#10B981" },
  { name: "Infrastruktur", value: 19, color: "#8B5CF6" },
  { name: "Sosial", value: 15, color: "#EC4899" },
  { name: "Pencemaran", value: 12, color: "#EF4444" },
];

export const MOCK_USER = {
  id: 1,
  name: "Budi Santoso",
  email: "budi.s@gmail.com",
  points: 340,
  level: "Kontributor Aktif",
  reports: 12,
  verified: 10,
  badges: [
    { id: 1, name: "Pelopor", icon: "🏅", desc: "Laporan pertama" },
    { id: 2, name: "10 Laporan", icon: "⭐", desc: "Submitted 10 reports" },
    { id: 3, name: "Terverifikasi", icon: "✅", desc: "5 laporan diverifikasi" },
    { id: 4, name: "Komunitas", icon: "🤝", desc: "Bantu validasi 3 laporan" },
  ],
};
