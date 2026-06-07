import { Report } from "@/app/types/report.type";
import { apiClient } from "@/lib/axios";

const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    title: "Jalan berlubang parah di Jl. Sudirman",
    description:
      "Ada lubang besar sekitar 50cm di tengah jalan, sangat berbahaya bagi pengendara motor khususnya di malam hari.",
    category: "road_damage",
    status: "in_progress",
    address: "Jl. Jend. Sudirman Km 2",
    photoUrl:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400",
    createdAt: new Date().toISOString(),
  },
];

export const reportApiService = {
  reports: {
    getMyReports: async (): Promise<Report[]> => {
      try {
        const res = await apiClient.get("/api/reports/me");

        const fetchedReports = res.data?.data
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        return fetchedReports.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      } catch (err) {
        console.warn(
          "API Laporan error/tidak terjangkau, menggunakan mock data.",
        );

        return new Promise((resolve) =>
          setTimeout(() => resolve(MOCK_REPORTS), 1000),
        );
      }
    },

    createReport: async (data: any): Promise<any> => {
      try {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);

        if (data.address) {
          formData.append("address", data.address);
        }

        if (data.latitude) {
          formData.append("latitude", data.latitude);
        }

        if (data.longitude) {
          formData.append("longitude", data.longitude);
        }

        formData.append("photo", data.photo);

        const res = await apiClient.post("/api/reports", formData);
        return res.data;
      } catch (err) {
        console.warn(
          "Gagal mengirim laporan ke server asli, menggunakan simulasi success.",
        );

        return new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 1500),
        );
      }
    },
  },
};