import { apiClient } from "@/lib/axios";
import { User } from "../types/user.type";

export const MOCK_USER: User = {
  id: "u1",
  email: "warga@example.com",
  fullName: "Budi Santoso",
  totalPoints: 1250,
  level: "Pelapor Aktif",
  badges: [
    { id: 1, name: "First Blood", desc: "Laporan pertama", icon: "🩸" },
    { id: 2, name: "Mata Elang", desc: "5 laporan terverifikasi", icon: "🦅" },
  ],
};


export const userApiService = {
  user: {
    getMe: async (): Promise<User> => {
      try {
        const res = await apiClient.get<User>("/api/users/me");
        return res.data;
      } catch (err) {
        console.warn("Gagal fetch user, menggunakan mock data.");
        return new Promise((resolve) =>
          setTimeout(() => resolve(MOCK_USER), 500),
        );
      }
    },
  },
};